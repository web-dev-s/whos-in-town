import type { User } from "../contexts/UserContext";
import type { UserSettings } from "../types";

const USER_SESSION_COOKIE_NAME = "user_session";
const COOKIE_CONSENT_NAME = "cookie_consent";
const SESSION_DURATION_SECONDS = 15 * 60; // 15 minutes
const SETTINGS_DURATION_SECONDS = 31536000; // 1 year

const getSettingsCookieName = (userId: number) =>
  btoa(`user_settings_${userId}`);

export const CookieService = {
  setUserSession: (user: User): void => {
    const value = btoa(JSON.stringify(user));
    document.cookie = `${USER_SESSION_COOKIE_NAME}=${value}; Max-Age=${SESSION_DURATION_SECONDS}; path=/; SameSite=Strict`;
  },

  getUserSession: (): User | null => {
    const name = `${USER_SESSION_COOKIE_NAME}=`; // This was already correct, but now the constant is defined.
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        try {
          const value = atob(c.substring(name.length, c.length));
          return JSON.parse(value) as User;
        } catch (e) {
          console.error("Failed to parse user session cookie", e);
          return null;
        }
      }
    }
    return null;
  },

  removeUserSession: (): void => {
    document.cookie = `${USER_SESSION_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`;
  },

  setSettingsCookie: (userId: number, settings: UserSettings): void => {
    const binString = Array.from(
      new TextEncoder().encode(JSON.stringify(settings)),
      (byte) => String.fromCharCode(byte)
    ).join("");
    const value = btoa(binString);
    document.cookie = `${getSettingsCookieName(userId)}=${value}; Max-Age=${SETTINGS_DURATION_SECONDS}; path=/; SameSite=Lax`;
  },

  getSettingsCookie: (userId?: number): UserSettings | null => {
    if (!userId) return null;
    const name = `${getSettingsCookieName(userId)}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        try {
          const binString = atob(c.substring(name.length, c.length));
          const uint8Array = Uint8Array.from(binString, (char) =>
            char.charCodeAt(0)
          );
          const jsonString = new TextDecoder().decode(uint8Array);
          return JSON.parse(jsonString) as UserSettings;
        } catch (e) {
          console.error("Failed to parse user settings cookie", e);
          return null;
        }
      }
    }
    return null;
  },

  removeSettingsCookie: (userId: number): void => {
    document.cookie = `${getSettingsCookieName(userId)}=; Max-Age=0; path=/; SameSite=Lax`; // Set Max-Age to 0 to delete
  },

  setCookieConsent: (): void => {
    document.cookie = `${COOKIE_CONSENT_NAME}=true; Max-Age=${SETTINGS_DURATION_SECONDS}; path=/; SameSite=Lax`;
  },

  getCookieConsent: (): boolean => {
    return document.cookie.includes(`${COOKIE_CONSENT_NAME}=true`);
  },
};
