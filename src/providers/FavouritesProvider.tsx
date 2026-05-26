import { useRef, type PropsWithChildren, useEffect, useContext } from "react";

import {
  FavoritesContext,
  defaultFavoritesContexttValue,
  type IFavoritesContext,
} from "../contexts/FavoritesContext";
import { UserContext } from "../contexts/UserContext";
import { UserStorageService } from "../api/userStorageService";
import { UserSettings } from "../types";

export const FavoritesProvider = function (
  props: PropsWithChildren,
): React.ReactElement {
  const contextValue = useRef<IFavoritesContext>(defaultFavoritesContexttValue);
  const userContext = useContext(UserContext);

  useEffect(() => {
    const user = userContext.user.getValue();

    if (!userContext.isAuthenticated.getValue() || !user) {
      contextValue.current.favorites.next([]);
      return;
    }

    // Hydrate: Initial load from cookie if current state is empty
    const latestSettings = UserStorageService.getUserSettings<UserSettings>(
      user.id.toString(),
    );

    if (
      latestSettings?.favorites &&
      contextValue.current.favorites.getValue().length === 0
    ) {
      contextValue.current.favorites.next(latestSettings.favorites);
    }

    const subscription = contextValue.current.favorites.subscribe(
      (favorites) => {
        const user = userContext.user.getValue();
        if (!user) return;

        const latestSettings = UserStorageService.getUserSettings<UserSettings>(
          user.id.toString(),
        );

        if (
          JSON.stringify(favorites) ===
          JSON.stringify(latestSettings?.favorites)
        )
          return;

        if (
          latestSettings?.persist_favourites &&
          userContext.user.getValue()?.id
        ) {
          UserStorageService.upsertUserSettings(user.id.toString(), {
            ...latestSettings,
            favorites,
          });
        }
      },
    );
    return () => subscription.unsubscribe();
  }, [userContext.isAuthenticated, userContext.user]);

  return (
    // eslint-disable-next-line react-hooks/refs
    <FavoritesContext.Provider value={contextValue.current}>
      {props.children}
    </FavoritesContext.Provider>
  );
};
