import { OpenAIEmbeddings } from "@langchain/openai";
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { openai } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const NEON_CONNECTION_STRING = process.env.DATABASE_URL;

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
});

const config = {
  postgresConnectionOptions: {
    connectionString: NEON_CONNECTION_STRING,
    ssl: true,
  },
  tableName: "langchain_pg_embedding",
  columns: {
    idColumnName: "id",
    vectorColumnName: "embedding",
    contentColumnName: "document",
    metadataColumnName: "cmetadata",
  },
};

const vectorStorePromise = PGVectorStore.initialize(embeddings, config)
  .then((store) => {
    console.log("VectorStore initialized successfully.");
    return store;
  })
  .catch((error) => {
    console.error("Error initializing VectorStore:", error);
    throw new Error("Failed to initialize vector store");
  });

const searchDocuments = async (query) => {
  try {
    const vectorStore = await vectorStorePromise;
    const retriever = vectorStore.asRetriever({
      k: 5,
      searchType: "similarity",
    });
    const documents = await retriever.invoke(query);
    return documents;
  } catch (error) {
    console.error("Error searching documents:", error);
    throw error;
  }
};

export async function POST(req) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: `Du er en assistent for spørgsmål-svar opgaver.
          Du kan hente information fra din vidensbase til at besvare henvendelser.  
          Brug hentet kontekst til at besvare spørgsmålet.
          Hvis du ikke kender svaret, så sig blot, at du ikke ved det.
          Brug maksimalt tre sætninger og hold svaret kortfattet.`,
    messages,
    tools: {
      hentKilder: tool({
        description:
          "Søg og hent dokumenter relateret til forespørgslen fra din vidensbase",
        parameters: z.object({
          question: z.string().describe("Brugerens spørgsmål"),
        }),
        execute: async ({ question }) => searchDocuments(question),
      }),
    },
    maxSteps: 5,
    onStepFinish({ text, toolCalls, toolResults }) {
      // Log or handle the results from each step
      console.log("Tool Calls:", toolCalls);
      console.log("Tool Results:", toolResults);
      console.log("Generated Text:", text);
    },
  });

  return result.toDataStreamResponse();
}
