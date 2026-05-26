import React, {
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { User } from "lucide-react";
import { ThemeToggle } from "../../components/Settings/ThemeToggle/ThemeToggle";
import { UserContext } from "../../contexts/UserContext";
import { useMediatorState } from "../../hooks/useMediatorState";
import { useTranslation } from "react-i18next";
import { SettingsButton } from "../../components/Settings/SettingsButton";
import { LanguageToggle } from "../../components/Settings/LanguageToggle";
import { useTheme } from "../../contexts/ThemeContext";
import "./Header.css";
import { useElementHeight } from "../../hooks/useElementHeight";
import { useSession } from "../../hooks/useSession";

export const Header: React.FC<PropsWithChildren> = () => {
  const userContext = useContext(UserContext);
  const { theme, toggleTheme } = useTheme();

  const { t, i18n } = useTranslation();
  const [, setIsLoginModalOpen] = useMediatorState(
    userContext.isLoginModalOpen,
  );

  const { user, isAuthenticated, handleLogout } = useSession();

  const [isSettingsLoaded, setIsSettingsLoaded] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      if (isSettingsLoaded) {
        (() => {
          setIsSettingsLoaded(false);
        })();
      }
      return;
    }

    if (!isSettingsLoaded) {
      const userSettings = userContext.userSettings.getValue();

      if (userSettings) {
        if (userSettings.lang) i18n.changeLanguage(userSettings.lang);
        if (userSettings.theme && theme !== userSettings.theme) toggleTheme();
      }
      (() => {
        setIsSettingsLoaded(true);
      })();

      return;
    }
  }, [
    isAuthenticated,
    user,
    userContext.userSettings,
    isSettingsLoaded,
    i18n,
    toggleTheme,
    theme,
  ]);

  const refHeader = useElementHeight("--height-header", "app-layout");
  return (
    <div className="header-container">
      <div className="header-top-row" ref={refHeader}>
        <div className="header-title">
          <h2 title="Who's In Town">Who's In Town</h2>
        </div>
        <div className="header-actions">
          {!isAuthenticated ? (
            <button
              className="header-login-btn"
              onClick={() => setIsLoginModalOpen(true)}
            >
              {t("buttons.login")}
            </button>
          ) : (
            <div className="user-profile">
              <div className="user-profile-trigger" title={user?.name || ""}>
                <User size={16} className="icon" />
                <span className="user-name-text">{user?.name}</span>
              </div>
              <div className="user-profile-dropdown">
                <button
                  className="header-button header-action-button language-toggle"
                  onClick={handleLogout}
                  title={user?.email}
                >
                  {t("buttons.logout")}
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
