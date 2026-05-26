import { useContext, useEffect, useCallback } from "react";
import { UserContext } from "../contexts/UserContext";
import { FavoritesContext } from "../contexts/FavoritesContext";
import { useMediatorState } from "./useMediatorState";
import { CookieService } from "../api/cookieService";
import { UserStorageService } from "../api/userStorageService";
import type { UserSettings } from "../types";

/**
 * Hook to manage user session, including restoration on mount,
 * logout logic, and a watchdog to monitor cookie expiration.
 */
export const useSession = () => {
  const userContext = useContext(UserContext);
  const favoritesContext = useContext(FavoritesContext);

  const [user, setUser] = useMediatorState(userContext.user);
  const [isAuthenticated, setIsAuthenticated] = useMediatorState(
    userContext.isAuthenticated,
  );
  const [, setFavorites] = useMediatorState(favoritesContext.favorites);

  const handleLogout = useCallback(() => {
    // Explicitly save favorites and settings before clearing the session
    if (user) {
      const userSettings = userContext.userSettings.getValue();

      const settingsToSave = {
        ...userSettings,
        favorites: userSettings?.persist_favourites
          ? favoritesContext.favorites.getValue()
          : [],
      } as UserSettings;

      console.log("Logout - Saving user settings:", settingsToSave);
      UserStorageService.upsertUserSettings(user.id.toString(), settingsToSave);
    }

    CookieService.removeUserSession();
    setUser(null);
    setIsAuthenticated(false);
    setFavorites([]); // Clear favorites from render on logout
  }, [user, userContext.userSettings, favoritesContext.favorites, setUser, setIsAuthenticated, setFavorites]);

  // Restore user session from cookie on mount to fix hydration on refresh
  useEffect(() => {
    const sessionUser = CookieService.getUserSession();
    if (sessionUser && !isAuthenticated) {
      setUser(sessionUser);
      setIsAuthenticated(true);
    }
  }, [isAuthenticated, setUser, setIsAuthenticated]);

  // Session Watchdog: Monitors cookie expiration while the app is running
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkSessionInterval = setInterval(() => {
      const session = CookieService.getUserSession();
      if (!session) {
        console.warn("User session cookie expired. Logging out...");
        handleLogout();
      }
    }, 50000); // Check every 50 seconds

    return () => clearInterval(checkSessionInterval);
  }, [isAuthenticated, handleLogout]);

  return {
    user,
    isAuthenticated,
    handleLogout,
    setUser,
    setIsAuthenticated,
  };
};