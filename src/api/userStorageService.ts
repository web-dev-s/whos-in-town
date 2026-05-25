import type { User } from "../contexts/UserContext";

const STORAGE_KEY = "registered_users_b64";

export const UserStorageService = {
  saveUsers: (users: User[]): void => {
    const jsonString = JSON.stringify(users);
    const base64String = btoa(jsonString);
    sessionStorage.setItem(STORAGE_KEY, base64String);
  },

  getUsers: (): User[] => {
    const base64String = sessionStorage.getItem(STORAGE_KEY);
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
};