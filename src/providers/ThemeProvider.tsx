import React, { useEffect, useState } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const persistTheme = localStorage.getItem("persist_theme") === "true";
    let initialTheme: "light" | "dark" | null = null;

    if (!persistTheme) {
      // Fallback to non-persisted local storage if persistence is off
      initialTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    }

    if (initialTheme) {
      return initialTheme;
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      // Default to system preference if no persisted theme
      return "dark";
    }


    return "light";
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

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
