import React, { createContext, useContext, useEffect, useState } from "react";

interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    // Check localStorage first
    const stored = localStorage.getItem("theme") as "light" | "dark" | null;
    if (stored) {
      return stored;
    }

    // Check system preference
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }

    return "light";
  });

  useEffect(() => {
    // Update DOM
    // Explicitly set data-theme to "light" or "dark"
    document.documentElement.setAttribute("data-theme", theme);

    // Save preference
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = (currentTheme?: "light" | "dark") => {
    setTheme((prev) =>
      currentTheme ? currentTheme : prev === "light" ? "dark" : "light",
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
