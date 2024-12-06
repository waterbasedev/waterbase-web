import "./globals.css";
import "@assistant-ui/react/styles/index.css";
import "@assistant-ui/react/styles/modal.css";
import "@assistant-ui/react-markdown/styles/markdown.css";
import { ThemeToggle } from "@/app/components/ThemeToggle";
import { ThemeProvider } from "next-themes";
import { MyRuntimeProvider } from "@/app/components/MyRuntimeProvider";
import { MyAssistantModal } from "@/components/assistant-ui/assistant-modal";

export const metadata = {
  title: "WaterBase",
  description: "Explore the knowledge base",
  icons: {
    icon: "/bulb.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <MyRuntimeProvider>
      <html lang="en" suppressHydrationWarning>
        <body>
          <ThemeProvider
            attribute="data-theme"
            defaultTheme="system"
            enableSystem
          >
            <div style={{ zIndex: 9999, position: "relative" }}>
              <MyAssistantModal />
            </div>
            <main>{children}</main>
            <ThemeToggle />
          </ThemeProvider>
        </body>
      </html>
    </MyRuntimeProvider>
  );
}
