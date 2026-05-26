const API_KEY = 'crwd_123';
const BASE_URL = 'https://crowded-frontend-assignment.netlify.app/api';

const defaultHeaders = {
  accept: 'application/json',
};

export const getArtist = async (artistId: string) => {
  if (!artistId) return null;
  const response = await fetch(
    `${BASE_URL}/artists/${encodeURIComponent(artistId)}?apiKey=${API_KEY}`,
    { headers: defaultHeaders }
  );
  if (!response.ok) throw new Error('Artist not found');
  const data = await response.json();
  // API returns "" if artist not found
  if (data === '' || data.error) return null;
  return data;
};

export const getArtistEvents = async (artistId: string) => {
  if (!artistId) return [];
  const response = await fetch(
    `${BASE_URL}/artists/${encodeURIComponent(artistId)}/events?apiKey=${API_KEY}`,
    { headers: defaultHeaders }
  );
  if (!response.ok) throw new Error('Events not found');
  return response.json();
};