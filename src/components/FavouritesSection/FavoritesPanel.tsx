import { useContext, useEffect, useState } from "react";
import { FavoriteItem } from "./FavoriteItem";
import { useTranslation } from "react-i18next";
import type { Event } from "../../types";
import { FavoritesContext } from "../../contexts/FavoritesContext";
import { useMediatorState } from "../../hooks/useMediatorState";
import { Heart } from "lucide-react";
import "./FavoritesPanel.css";

interface FavoritesPanelProps {
  favorites: Event[];
  onSearch: (term: string) => void;
  onSelect: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function FavoritesPanel({
  favorites,
  onSearch,
  onSelect,
  isOpen,
  onClose,
}: FavoritesPanelProps) {
  const { t } = useTranslation();
  const favouritesContext = useContext(FavoritesContext);
  const [, setIsFavouritePanelOpen] = useMediatorState(
    favouritesContext.isFavouritePanelOpen,
  );

  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth > 1024 : true,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1025px)");

    const updateDesktop = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsDesktop(event.matches);
      if (event.matches) {
        onClose();
      }
    };

    updateDesktop(mediaQuery);
    mediaQuery.addEventListener("change", updateDesktop);

    return () => mediaQuery.removeEventListener("change", updateDesktop);
  }, [onClose]);

  return (
    <>
      {!isDesktop && isOpen && (
        <div className="drawer-backdrop" onClick={onClose} />
      )}
      <aside
        className={`favorites-sidebar column ${!isDesktop ? "drawer" : ""} ${isOpen ? "open" : ""}`}
      >
        {!isDesktop && !isOpen && (
          <button
            className="drawer-handle"
            onClick={() => setIsFavouritePanelOpen(true)}
            aria-label={isOpen ? "Close favorites" : "Open favorites"}
          >
            <Heart size={24} fill={favorites.length > 0 ? "#ef4444" : "none"} color={favorites.length > 0 ? "#ef4444" : "currentColor"} />
            <span className="handle-text">{t("titles.favorites")}</span>
            <span className="handle-arrows">{"<<"}</span>
            {favorites.length > 0 && (
              <span className="handle-badge">{favorites.length}</span>
            )}
          </button>
        )}

        <h2>{t("titles.favorites")}</h2>

        {favorites.length === 0 ? (
          <p className="empty-msg">{t("messages.noFavourites")}</p>
        ) : (isDesktop || isOpen) && (
          <div className="scrollable-content">
            {favorites.map((fav) => (
              <FavoriteItem
                key={fav.id}
                event={fav}
                onSearch={onSearch}
                onSelect={(id) => {
                  onSelect(id);
                  if (!isDesktop) onClose();
                }}
              />
            ))}
          </div>
        )}
      </aside>
    </>
  );
}
