import { useRef, type PropsWithChildren, useEffect, useContext } from "react";

import {
  FavoritesContext,
  defaultFavoritesContexttValue,
  type IFavoritesContext,
} from "../contexts/FavoritesContext";
import { CookieService } from "../api/cookieService";
import { UserContext } from "../contexts/UserContext";
import { useMediatorState } from "../hooks/useMediatorState";

export const FavoritesProvider = function (
  props: PropsWithChildren,
): React.ReactElement {
  const contextValue = useRef<IFavoritesContext>(defaultFavoritesContexttValue);
  const userContext = useContext(UserContext);
  const [user] = useMediatorState(userContext.user);
  const [isAuthenticated] = useMediatorState(userContext.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      contextValue.current.favorites.next([]);
      return;
    }

    // Hydrate: Initial load from cookie if current state is empty
    const settings = CookieService.getSettingsCookie(user.id);
    if (settings?.favorites && contextValue.current.favorites.getValue().length === 0) {
      contextValue.current.favorites.next(settings.favorites);
    }

    const subscription = contextValue.current.favorites.subscribe((favorites) => {
      const persistFavouritesFlag = localStorage.getItem("persist_favourites") === "true";
      const latestSettings = CookieService.getSettingsCookie(user.id) || {};

      // Improved Safeguard: Handle potential undefined values and empty arrays accurately
      const currentFavoritesStr = JSON.stringify(favorites);
      const savedFavoritesStr = JSON.stringify(latestSettings.favorites || []);
      
      if (currentFavoritesStr === savedFavoritesStr) return;

      if (persistFavouritesFlag) {
        CookieService.setSettingsCookie(user.id, { ...latestSettings, favorites });
      }
    });
    return () => subscription.unsubscribe();
  }, [user, isAuthenticated]);

  return (
    // eslint-disable-next-line react-hooks/refs
    <FavoritesContext.Provider value={contextValue.current}>
      {props.children}
    </FavoritesContext.Provider>
  );
};
