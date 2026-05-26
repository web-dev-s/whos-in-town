import React, { useEffect, useState, useCallback } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const persistTheme = localStorage.getItem("persist_theme") === "true";
    const storedTheme = !persistTheme ? (localStorage.getItem("theme") as "light" | "dark" | null) : null;

    if (storedTheme) return storedTheme;

    // Default to system preference or light
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    // Update DOM
    // Explicitly set data-theme to "light" or "dark"
    document.documentElement.setAttribute("data-theme", theme);

    // Only save to localStorage if not persisting to cookie, for non-persisted state
    if (localStorage.getItem("persist_theme") !== "true") {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
