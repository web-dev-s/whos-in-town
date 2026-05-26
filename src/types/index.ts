export interface Artist {
  id: string;
  name: string;
  image_url: string;
  thumb_url: string;
  facebook_page_url: string;
  mbid: string;
  url: string;
  upcoming_event_count?: number;
}

export interface Venue {
  name: string;
  city: string;
  region: string;
  country: string;
}

export interface Offer {
  type: string;
  url: string;
  status: string;
}

export interface Event {
  id: string;
  artist_id: string;
  datetime: string;
  lineup: string[];
  venue: Venue;
  offers: Offer[];
  description?: string;
}

export interface UserSettings {
  theme?: "dark" | "light";
  lang?: "en" | "de";
  favorites?: Event[];
  persist_favourites: boolean;
  persist_language: boolean;
  persist_theme: boolean;
}
