import { useArtistSearch } from "../hooks/useArtistSearch";
import { ArtistCard } from "./ArtistCard/ArtistCard";
import { SearchResultCard } from "./SearchResultCard/SearchResultCard";
import { SelectedEventPanel } from "./SelectedEventPanel/SelectedEventPanel";
import { FavoritesPanel } from "./FavouritesSection/FavoritesPanel";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { FavoritesContext } from "../contexts/FavoritesContext";
import { SearchBar } from "./SearchBar/SearchBar";
import { useMediatorState } from "../hooks/useMediatorState";
import { useTranslation } from "react-i18next";
import "./Content.css";
import { useElementHeight } from "../hooks/useElementHeight";

export function Content() {
  const { t } = useTranslation();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const favouritesContext = useContext(FavoritesContext);
  const [favorites] = useMediatorState(favouritesContext.favorites);
  const [isFavouritePanelOpen, setIsFavouritePanelOpen] = useMediatorState(
    favouritesContext.isFavouritePanelOpen,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [searchArtist, setSearchArtist] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchArtist(searchTerm);
    }, 1500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  const { artist, events, isLoading, error } = useArtistSearch(searchArtist);

  const selectedEvent = useMemo(() => {
    if (!selectedEventId) return null;
    return (
      events?.find((e) => e.id === selectedEventId) ||
      favorites.find((e) => e.id === selectedEventId) ||
      null
    );
  }, [events, favorites, selectedEventId]);

  const selectedPanelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (selectedEventId && selectedPanelRef.current) {
      if (window.innerWidth <= 800) {
        selectedPanelRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      } else {
        selectedPanelRef.current.scrollTop = 0;
      }
    }
  }, [selectedEventId]);

  const contentRef = useElementHeight("--height-content", "app-layout");
  return (
    <div className="content-wrapper" ref={contentRef}>
      <div className="three-column-container">
        <section className="left-panel column">
          <div className="column-search-container">
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              handleSearch={setSearchArtist}
              isSearching={isLoading}
            />
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
              {artist && !events?.length && !isLoading && !error && (
                <p className="empty-msg">{t("messages.noEventsRegistered")}</p>
              )}
            </div>
          </div>
        </section>

        {/* Column 2: Selection */}
        <section ref={selectedPanelRef} className="selected-panel column">
          <div className="panel-header selected-panel-header">
            <h2>{t("titles.selectedEvent")}</h2>
          </div>

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
