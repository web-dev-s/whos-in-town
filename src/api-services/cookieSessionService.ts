import type { User } from "../contexts/UserContext";

const USER_SESSION_COOKIE_NAME = "user_session";
const COOKIE_CONSENT_NAME = "cookie_consent";
const SESSION_DURATION_SECONDS = 5 * 60; // 5 minutes
const SETTINGS_DURATION_SECONDS = 31536000; // 1 year



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
  setCookieConsent: (): void => {
    document.cookie = `${COOKIE_CONSENT_NAME}=true; Max-Age=${SETTINGS_DURATION_SECONDS}; path=/; SameSite=Lax`;
  },

  getCookieConsent: (): boolean => {
    return document.cookie.includes(`${COOKIE_CONSENT_NAME}=true`);
  },
};
