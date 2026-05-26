import { useMediatorState } from "../hooks/useMediatorState";
import { UserContext } from "../contexts/UserContext";
import { UserStorageService } from "../api/userStorageService";
import { skip } from "rxjs";
import type { Event } from "../types";
import { FavoritesContext } from "../contexts/FavoritesContext";
import { useContext, useEffect } from "react";

export function useAutoSyncStorage(): void {
  const favouritesContext = useContext(FavoritesContext); 
  const userContext = useContext(UserContext);
 
  function propagateDependencies(newFavorites: Event[]) {
    console.log(" useAutoSyncStorage propagateDependencies ", newFavorites);
    const updatedUserSettings = {
      ...userContext.userSettings.getValue(),
      favorites: newFavorites,
    };
    userContext.userSettings.next(updatedUserSettings);
    console.log(
      " useAutoSyncStorage useAutoSyncStorage user in context",
    
      userContext.user.getValue(),
    );

    const useId = userContext.user.getValue()?.id.toString();
    if (useId) {
      UserStorageService.upsertUserSettings(useId, {
        ...userContext.userSettings.getValue(),
        favorites: newFavorites,
      });
    }
  }
  useEffect(() => {
    const subscription = favouritesContext.favorites
      .pipe(skip(1))
      .subscribe((contextValue: Event[]) => {
        console.log(
          "useAutoSyncStorage subscribe at contextValue",
          contextValue,
        );
        propagateDependencies(contextValue);
      });
    return (): void => {
      subscription.unsubscribe();
    };
  }, []);
}
