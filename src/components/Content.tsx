import { useArtistSearch } from "../hooks/useArtistSearch";
import { ArtistCard } from "./ArtistCard/ArtistCard";
import { SearchResultCard } from "./SearchResultCard/SearchResultCard";
import { SelectedEventPanel } from "./SelectedEventPanel/SelectedEventPanel";
import { FavoritesPanel } from "./FavouritesSection/FavoritesPanel";
import { useContext, useMemo, useState } from "react";
import { FavoritesContext } from "../contexts/FavoritesContext";
import "./Content.css";
import { SearchBar } from "./SearchBar/SearchBar";
import { useMediatorState } from "../hooks/useMediatorState";
import { useTranslation } from "react-i18next";

interface ContentProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export function Content({ searchTerm, setSearchTerm }: ContentProps) {
  const { t } = useTranslation();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const favouritesContext = useContext(FavoritesContext);
  const [favorites] = useMediatorState(favouritesContext.favorites);
  const [isFavouritePanelOpen, setIsFavouritePanelOpen] = useMediatorState(
    favouritesContext.isFavouritePanelOpen,
  );

  const { artist, events, isLoading, error } = useArtistSearch(searchTerm);

  const selectedEvent = useMemo(() => {
    if (!selectedEventId) return null;
    return (
      events?.find((e) => e.id === selectedEventId) ||
      favorites.find((e) => e.id === selectedEventId) ||
      null
    );
  }, [events, favorites, selectedEventId]);

  return (
    <div className="content-wrapper">
      <div className="three-column-container">
        <section className="left-panel column">
          <div className="column-search-container">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>
          <div className="scrollable-content">
            {isLoading && <p className="loading">{t("messages.searching")}</p>}
            {error && (
              <p className="error">{t("messages.errorFindingArtist")}</p>
            )}

            {artist && <ArtistCard artist={artist} />}

            <div className="event-list">
              {events?.map((event) => (
                <SearchResultCard
                  key={event.id}
                  event={event}
                  selected={event.id === selectedEventId}
                  onSelect={() => setSelectedEventId(event.id)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Column 2: Selection */}
        <section className="selected-panel column">
          <h2>{t("titles.selectedEvent")}</h2>
          <SelectedEventPanel event={selectedEvent} />
        </section>

        <FavoritesPanel
          favorites={favorites}
          onSearch={setSearchTerm}
          onSelect={(id) => {
            setSelectedEventId(id);
            setIsFavouritePanelOpen(false);
          }}
          isOpen={isFavouritePanelOpen}
          onClose={() => setIsFavouritePanelOpen(false)}
        />
      </div>
    </div>
  );
}
