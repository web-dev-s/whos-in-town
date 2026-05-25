import { createContext } from "react";
import { BehaviorSubject } from "rxjs";
import type { Event } from "../types";

export interface IFavoritesContext {
  favorites: BehaviorSubject<Event[]>;
  isFavouritePanelOpen: BehaviorSubject<boolean>;
 
}

export const getDefaultAppContextValue = (): IFavoritesContext => ({
  favorites: new BehaviorSubject<Event[]>([]),
  isFavouritePanelOpen: new BehaviorSubject<boolean>(false),
});

export const defaultFavoritesContexttValue = getDefaultAppContextValue();
export const FavoritesContext = createContext<IFavoritesContext>(
  getDefaultAppContextValue(),
);
