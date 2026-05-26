import { useTheme } from "../../../contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";
import "../../../App.css";
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="header-button header-action-button"
      onClick={() => toggleTheme()}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
    >
      {theme === "light" ? (
        <Moon size={20} />
      ) : (
        <Sun size={20} />
      )}
    </button>
  );
}
