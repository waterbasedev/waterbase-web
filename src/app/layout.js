import "./globals.css";
import { ThemeToggle } from "@/app/components/ThemeToggle";
import { ThemeProvider } from "next-themes";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
        >
          <main>{children}</main>
          <ThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}
