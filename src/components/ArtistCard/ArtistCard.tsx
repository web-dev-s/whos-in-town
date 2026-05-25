import type { Artist } from "../../types";
import "./ArtistCard.css";

interface ArtistCardProps {
  artist: Artist;
}

export function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <div className="artist-card">
      <img src={artist.image_url} alt={artist.name} className="artist-avatar" />
      <div className="artist-info">
        <h3 title={artist.name}>{artist.name}</h3>
        {!!artist.upcoming_event_count && artist.upcoming_event_count > 0 && (
          <span className="tour-badge">On Tour</span>
        )}
      </div>
    </div>
  );
}
