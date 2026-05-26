import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FavoritesProvider } from "./FavouritesProvider";
import { ThemeProvider } from "./ThemeProvider";
import { UserProvider } from "./UserProvider";
import "./lang/i18n"; // Import i18n configuration

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
    },
  },
});

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <UserProvider>
        <QueryClientProvider client={queryClient}>
          <FavoritesProvider>
            {children}
          </FavoritesProvider>
        </QueryClientProvider>
      </UserProvider>
    </ThemeProvider>
  );
};