import { createContext, useContext } from "react";

interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: (theme?: "light" | "dark") => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
