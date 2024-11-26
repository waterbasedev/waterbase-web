"use client";

import { Moon, Sun } from "lucide-react";
import { useThemeToggle } from "@/app/hooks/useTheme";
import styles from "./ThemeToggle.module.css";

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useThemeToggle();

  if (!mounted) {
    return null;
  }

  return (
    <button
      className={styles.button}
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className={styles.icon} />
      ) : (
        <Moon className={styles.icon} />
      )}
    </button>
  );
}
