import React from "react";
import { Search, X, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import "./SearchBar.css";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: (term: string) => void;
  isSearching?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  setSearchTerm,
  handleSearch,
  isSearching,
}) => {
  const { t } = useTranslation();

  const handleSearchSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearch(searchTerm.trim());
  };

  return (
    <div className="search-bar-row">
      <form onSubmit={handleSearchSubmit} className="search-bar">
        {isSearching ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          <Search size={20} />
        )}
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t("placeholders.searchArtist")}
          aria-label="Search for an artist"
        />
        {searchTerm.length > 0 && (
          <button
            type="button"
            className="search-bar-clear-btn"
            onClick={() => {
              setSearchTerm("");
            }}
            aria-label={t("ariaLabels.clearSearch")}
          >
            <X size={18} />
          </button>
        )}
        <button
          type="submit"
          className="search-submit-btn"
          disabled={isSearching}
        >
          {t("buttons.search")}
        </button>
      </form>
    </div>
  );
};
