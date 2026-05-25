import React, { useContext } from "react";
import { Star } from "lucide-react";
import type { Event } from "../../types";
import { useMediatorState } from "../../hooks/useMediatorState";
import { FavoritesContext } from "../../contexts/FavoritesContext";
import "./FavoriteItem.css";

interface FavoriteItemProps {
  event: Event;
  onSearch: (term: string) => void;
  onSelect: (id: string) => void;
}

export const FavoriteItem: React.FC<FavoriteItemProps> = ({
  event,
  onSearch,
  onSelect,
}) => {
  const favouritesContext = useContext(FavoritesContext);
  const [favorites, setFavourites] = useMediatorState(
    favouritesContext.favorites,
  );
  
  const toggleFavorite = (event: Event) => {
    const isFav = favorites.some((f) => f.id === event.id);
    const updatedFavourites: Event[] = isFav
      ? favorites.filter((f) => f.id !== event.id)
      : [...favorites, event];
    setFavourites(updatedFavourites);
  };

  const handleInteraction = () => {
    const lineupSearch = event.lineup?.join(" ") || event.artist_id;
    onSearch(lineupSearch);
    onSelect(event.id);
  };

  return (
    <div
      className="fav-card"
      onClick={handleInteraction}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleInteraction();
        }
      }}
    >
      <button
        className="remove-fav"
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(event);
        }}
        aria-label="Remove from favorites"
      >
        <Star size={18} fill="#facc15" color="#facc15" />
      </button>
      <div className="fav-info">
        <strong>{event.venue.name}</strong>
        <span>{event.venue.city}</span>
      </div>
    </div>
  );
};
