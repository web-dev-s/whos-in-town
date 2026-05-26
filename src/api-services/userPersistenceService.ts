import type { User } from "../contexts/UserContext";

const STORAGE_KEY = "u_reg";
const getUserSettingsKey = (userId: string) => `u_set_per_${userId}`;

export const UserStorageService = {
  saveUsers: (users: User[]): void => {
    const jsonString = JSON.stringify(users);
    const base64String = btoa(jsonString);
    localStorage.setItem(STORAGE_KEY, base64String);
  },

  getUsers: (): User[] => {
    const base64String = localStorage.getItem(STORAGE_KEY);
    if (!base64String) {
      return [];
    }
    try {
      const jsonString = atob(base64String);
      return JSON.parse(jsonString) as User[];
    } catch (e) {
      console.error("Failed to retrieve users from session storage", e);
      return [];
    }
  },

  getUserSettings: <T = unknown>(userId: string): T | null => {
    const key = getUserSettingsKey(userId);
    const base64String = localStorage.getItem(key);
    if (!base64String) {
      return null;
    }

    try {
      const jsonString = atob(base64String);
      return JSON.parse(jsonString) as T;
    } catch (e) {
      console.error(`Failed to retrieve settings for user ${userId} from session storage`, e);
      return null;
    }
  },

  upsertUserSettings: <T = unknown>(userId: string, settings: T): void => {
    const key = getUserSettingsKey(userId);
    const jsonString = JSON.stringify(settings);
    const base64String = btoa(jsonString);
    localStorage.setItem(key, base64String);
  },
};
