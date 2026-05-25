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

export const Header: React.FC<PropsWithChildren> = () => {
  const userContext = useContext(UserContext);
  const { theme, toggleTheme } = useTheme();
  
  const { t, i18n } = useTranslation();
  const [, setIsLoginModalOpen] = useMediatorState(userContext.isLoginModalOpen);
  const [user, setUser] = useMediatorState(userContext.user);
  const [isAuthenticated, setIsAuthenticated] = useMediatorState(userContext.isAuthenticated);
  const favoritesContext = useContext(FavoritesContext);
  const [favorites, setFavorites] = useMediatorState(favoritesContext.favorites);

  const [isSettingsLoaded, setIsSettingsLoaded] = useState(false);

  // Sync settings with user-specific cookie via CookieService
  useEffect(() => {
    if (!isAuthenticated || !user) {
      if (isSettingsLoaded){(()=>{setIsSettingsLoaded(false);})() }
      return;
    }

    // Initial load from cookie when user is first detected (login or refresh)
    if (!isSettingsLoaded) {
      const settings = CookieService.getSettingsCookie(user.id);
      if (settings) {
        setFavorites(settings.favorites || []);
        if (settings.lang) i18n.changeLanguage(settings.lang);
        if (settings.theme && theme !== settings.theme) toggleTheme();
      } else {
        setFavorites([]);
      }
      (()=>{ setIsSettingsLoaded(true);})()
     
      return;
    }

    // Persist changes to the cookie
    if (localStorage.getItem("persist_favourites") === "true") {
      const current = CookieService.getSettingsCookie(user.id) || {};
      CookieService.setSettingsCookie(user.id, { ...current, favorites });
    }
  }, [favorites, isAuthenticated, user, isSettingsLoaded, setFavorites, i18n, toggleTheme]);

  const handleLogout = () => {
    CookieService.removeUserSession();
    setUser(null);
    setIsAuthenticated(false);
    setFavorites([]); // Clear favorites from render on logout
  };

  return (
    <div className="header-container">
      <div className="header-top-row">
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
                <button className="logout-button" onClick={handleLogout} title={user?.email}>
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
