import "./globals.css";
import "@assistant-ui/react/styles/index.css";
import "@assistant-ui/react/styles/modal.css";
import "@assistant-ui/react-markdown/styles/markdown.css";
import { ThemeToggle } from "@/app/components/ThemeToggle";
import { ThemeProvider } from "next-themes";
import { MyRuntimeProvider } from "@/app/components/MyRuntimeProvider";
import { AssistantModal } from "@assistant-ui/react";

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
              <AssistantModal />
            </div>
            <main>{children}</main>
            <ThemeToggle />
          </ThemeProvider>
        </body>
      </html>
    </MyRuntimeProvider>
  );
}
