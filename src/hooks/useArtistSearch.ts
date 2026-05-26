import { useQuery } from '@tanstack/react-query';
import { getArtist, getArtistEvents } from '../api-services/restClient';
import type { Artist, Event } from '../types';

export const useArtistSearch = (searchTerm: string) => {
  const artistQuery = useQuery<Artist | null>({
    queryKey: ['artist', searchTerm],
    queryFn: () => getArtist(searchTerm),
    enabled: !!searchTerm,
  });

  const eventsQuery = useQuery<Event[]>({
    queryKey: ['events', searchTerm],
    queryFn: () => getArtistEvents(searchTerm),
    enabled: !!searchTerm,
  });

  return {
    artist: artistQuery.data,
    events: eventsQuery.data,
    isLoading: artistQuery.isLoading || eventsQuery.isLoading,
    error: artistQuery.error || eventsQuery.error,
  };
};