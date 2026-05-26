import { MapPin, Calendar } from "lucide-react";
import type { Event } from "../../types";
import "./SearchResultCard.css";

interface SearchResultCardProps {
  event: Event;
  selected: boolean;
  onSelect: () => void;
}

export function SearchResultCard({
  event,
  selected,
  onSelect,
}: SearchResultCardProps) {
  return (
    <div
      className={`search-result-card ${selected ? "selected" : ""}`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onSelect();
        }
      }}
      aria-pressed={selected}
    >
      <div className="result-content">
        <h4 className="result-title" title={event.venue.name}>{event.venue.name}</h4>
        <div className="result-meta">
          <div className="meta-item">
            <Calendar size={14} />
            <span>{new Date(event.datetime).toLocaleDateString()}</span>
          </div>
          <div className="meta-item">
            <MapPin size={14} />
            <span>
              {event.venue.city}, {event.venue.country}
            </span>
          </div>
        </div>
        {event.description && (
          <p className="result-description">{event.description}</p>
        )}
      </div>
    </div>
  );
}
