import { createContext } from "react";
import { BehaviorSubject } from "rxjs";
import { CookieService } from "../api-services/cookieSessionService";
import type { UserSettings } from "../types";
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface IUserContext {
  user: BehaviorSubject<User | null>;
  isAuthenticated: BehaviorSubject<boolean>;
  isLoginModalOpen: BehaviorSubject<boolean>;
  isSettingsModalOpen: BehaviorSubject<boolean>;
  userSettings: BehaviorSubject<UserSettings | null>;
}

const initialUser = CookieService.getUserSession();

export const defaultUserContextValue: IUserContext = {
  user: new BehaviorSubject<User | null>(initialUser),
  isAuthenticated: new BehaviorSubject<boolean>(!!initialUser),
  isLoginModalOpen: new BehaviorSubject<boolean>(false),
  isSettingsModalOpen: new BehaviorSubject<boolean>(false),
  userSettings: new BehaviorSubject<UserSettings | null>(null),
};

export const UserContext = createContext<IUserContext>(defaultUserContextValue);