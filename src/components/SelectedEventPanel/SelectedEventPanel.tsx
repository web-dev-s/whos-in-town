import React, { useContext, useMemo } from "react";
import { Heart, MapPin, Calendar, Globe, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { FavoritesContext } from "../../contexts/FavoritesContext";
import { useMediatorState } from "../../hooks/useMediatorState";
import type { Event } from "../../types";
import "./SelectedEventPanel.css";

interface SelectedEventPanelProps {
  event: Event | null;
}

export const SelectedEventPanel: React.FC<SelectedEventPanelProps> = ({
  event,
}) => {
  const { t } = useTranslation();
  const favouritesContext = useContext(FavoritesContext);
  const [favorites, setFavourites] = useMediatorState(
    favouritesContext.favorites,
  );

  const isFavorite = useMemo(
    () => (event ? favorites.some((f) => f.id === event.id) : false),
    [event, favorites],
  );

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!event) return;

    const updatedFavourites: Event[] = isFavorite
      ? favorites.filter((f) => f.id !== event.id)
      : [...favorites, event];

    setFavourites(updatedFavourites);
  };

  return (
    <div className="scrollable-content">
      {event ? (
        <div className="event-details">
          <div className="event-details-header">
            <h3 title={event.venue.name}>{event.venue.name}</h3>
            <button
              className={`fav-btn ${isFavorite ? "active" : ""}`}
              onClick={toggleFavorite}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart fill={isFavorite ? "currentColor" : "none"} size={24} />
            </button>
          </div>

          <div className="event-details-body">
            <div className="metadata-section">
              <div className="metadata-item">
                <Calendar size={18} />
                <div>
                  <span className="label">{t('labels.dateTime')}</span>
                  <span className="value">
                    {new Date(event.datetime).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="venue-section">
              <h4>{t('titles.venueInformation')}</h4>
              <div className="venue-details">
                <div className="venue-item">
                  <MapPin size={16} />
                  <div>
                    <span className="label">{t('labels.location')}</span>
                    <span className="value">{event.venue.name}</span>
                  </div>
                </div>
                <div className="venue-item">
                  <Globe size={16} />
                  <div>
                    <span className="label">{t('labels.cityCountry')}</span>
                    <span className="value">
                      {event.venue.city}, {event.venue.country}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {event.description && (
              <div className="description-section">
                <h4>{t('titles.description')}</h4>
                <p>{event.description}</p>
              </div>
            )}

            {event.offers && event.offers.length > 0 && (
              <div className="offers-section">
                <h4>{t('titles.availableOffers')}</h4>
                <div className="offers-list">
                  {event.offers.map((offer, index) => (
                    <a
                      key={index}
                      href={offer.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="offer-link"
                    >
                      <span>{offer.type || "Get Tickets"}</span>
                      <ExternalLink size={14} />
                    </a>
                  ))}
                </div>
              </div>
            )}

            <button
              className={`favorite-action-btn ${isFavorite ? "active" : ""}`}
              onClick={toggleFavorite}
            >
              {isFavorite 
                ? `❤ ${t('buttons.removeFromFavorites')}` 
                : `🤍 ${t('buttons.addToFavorites')}`}
            </button>
          </div>
        </div>
      ) : (
        <div className="empty-selection">
          <p>{t('messages.selectEventPrompt')}</p>
        </div>
      )}
    </div>
  );
};