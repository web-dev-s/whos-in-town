import React, { useContext, useEffect, useState, type PropsWithChildren } from "react";
import { User } from "lucide-react";
import { ThemeToggle } from "../../components/Settings/ThemeToggle/ThemeToggle";
import { UserContext } from "../../contexts/UserContext";
import { useMediatorState } from "../../hooks/useMediatorState";
import { useTranslation } from "react-i18next";
import { CookieService } from "../../api/cookieService";
import { SettingsButton } from "../../components/Settings/SettingsButton";
import { LanguageToggle } from "../../components/Settings/LanguageToggle";
import { FavoritesContext } from "../../contexts/FavoritesContext";
import { useTheme } from "../../contexts/ThemeContext";
import "./Header.css";
import type { UserSettings } from "../../types";
import { useElementHeight } from "../../hooks/useElementHeight";

export const Header: React.FC<PropsWithChildren> = () => {
  const userContext = useContext(UserContext);
  const { theme, toggleTheme } = useTheme();
  
  const { t, i18n } = useTranslation();
  const [, setIsLoginModalOpen] = useMediatorState(userContext.isLoginModalOpen);
  const [user, setUser] = useMediatorState(userContext.user);
  const [isAuthenticated, setIsAuthenticated] = useMediatorState(userContext.isAuthenticated);
  const favoritesContext = useContext(FavoritesContext);
  const [, setFavorites] = useMediatorState(favoritesContext.favorites);

  const [isSettingsLoaded, setIsSettingsLoaded] = useState(false);

  // Restore user session from cookie on mount to fix hydration on refresh
  useEffect(() => {
    (() => {
      const sessionUser = CookieService.getUserSession();
      if (sessionUser) {
        setUser(sessionUser);
        setIsAuthenticated(true);
      }
    })();
  }, []);

  // Sync theme and language with user-specific cookie
  useEffect(() => {
    if (!isAuthenticated || !user) {
      if (isSettingsLoaded) {
        (() => { setIsSettingsLoaded(false); })();
      }
      return;
    }

    // Initial load from cookie when user is first detected (login or refresh)
    if (!isSettingsLoaded) {
      const settings = CookieService.getSettingsCookie(user?.id);
      if (settings) {
        if (settings.lang) i18n.changeLanguage(settings.lang);
        if (settings.theme && theme !== settings.theme) toggleTheme();
      }
      (() => { setIsSettingsLoaded(true); })();
     
      return;
    }
  }, [isAuthenticated, user, isSettingsLoaded, i18n, toggleTheme, theme]);

  const handleLogout = () => {
    // Explicitly save favorites and settings before clearing the session
    if (user) {
      const currentSettings = CookieService.getSettingsCookie(user.id) || {};
      const settingsToSave: UserSettings = {
        ...currentSettings,
        favorites: localStorage.getItem("persist_favourites") === "true" 
          ? favoritesContext.favorites.getValue() 
          : currentSettings.favorites,
        theme: localStorage.getItem("persist_theme") === "true" 
          ? theme 
          : currentSettings.theme,
        lang: localStorage.getItem("persist_language") === "true" 
          ? i18n.language as "en" | "de" 
          : currentSettings.lang
      };
      CookieService.setSettingsCookie(user.id, settingsToSave);
    }

    CookieService.removeUserSession();
    setUser(null);
    setIsAuthenticated(false);
    setFavorites([]); // Clear favorites from render on logout
  };
  const refHeader = useElementHeight('--height-header', "app-layout");
  return (
    <div className="header-container" ref={refHeader}>
      <div className="header-top-row" style={{ height: 'var(--height-header)' }}>
        <div className="header-title">
          <h2 title="Who's In Town">Who's In Town</h2>
        </div>
        <div className="header-actions">
          {!isAuthenticated ? (
            <button className="header-login-btn" onClick={() => setIsLoginModalOpen(true)}>
              {t('buttons.login')}
            </button>
          ) : (
            <div className="user-profile">
              <div className="user-profile-trigger" title={user?.name || ''}>
                <User size={16} className="icon" />
                <span className="user-name-text">{user?.name}</span>
              </div>
              <div className="user-profile-dropdown">
                <button  className="header-button header-action-button language-toggle" onClick={handleLogout} title={user?.email}>
                  {t('buttons.logout')}
                </button>
              </div>
            </div>
          )}
          {isAuthenticated && <SettingsButton />}
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};
