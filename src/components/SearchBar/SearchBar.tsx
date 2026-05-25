import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import "./SearchBar.css";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  setSearchTerm,
}) => {
  const { t } = useTranslation();
  const [input, setInput] = useState(searchTerm);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(input.trim());
  };

  return (
    <div className="search-bar-row">
      <form onSubmit={handleSearchSubmit} className="search-bar">
        <Search size={20} />
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("placeholders.searchArtist")}
          aria-label="Search for an artist"
        />
        {input.length > 0 && (
          <button
            type="button"
            className="search-bar-clear-btn"
            onClick={() => setInput("")}
            aria-label="Clear search input"
          >
            <X size={18} />
          </button>
        )}
        <button type="submit" className="search-submit-btn">
          {t("buttons.search")}
        </button>
      </form>
    </div>
  );
};
