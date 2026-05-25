import { useRef, type PropsWithChildren, useEffect } from "react";

import {
  FavoritesContext,
  defaultFavoritesContexttValue,
  type IFavoritesContext,
} from "../contexts/FavoritesContext";
import { CookieService } from "../api/cookieService";

export const FavoritesProvider = function (
  props: PropsWithChildren,
): React.ReactElement {
  const contextValue = useRef<IFavoritesContext>(defaultFavoritesContexttValue);

  useEffect(() => {
    const subscription = contextValue.current.favorites.subscribe((favorites) => {
      const persistFavouritesFlag = localStorage.getItem("persist_favourites") === "true";
      const currentSettings = CookieService.getSettingsCookie() || {};
      if (persistFavouritesFlag) {
        CookieService.setSettingsCookie({ ...currentSettings, favorites });
      } else {
        CookieService.setSettingsCookie({ ...currentSettings, favorites: undefined });
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    // eslint-disable-next-line react-hooks/refs
    <FavoritesContext.Provider value={contextValue.current}>
      {props.children}
    </FavoritesContext.Provider>
  );
};
