import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export const useThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (!mounted) return;
    const currentTheme = theme === "system" ? systemTheme : theme;
    setTheme(currentTheme === "dark" ? "light" : "dark");
  };

  return {
    theme: mounted ? theme : undefined,
    toggleTheme,
    mounted,
  };
};
