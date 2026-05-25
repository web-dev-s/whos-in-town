import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { useMediatorState } from "../../../hooks/useMediatorState";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../contexts/ThemeContext";
import { CookieService } from "../../../api/cookieService";
import "../../../App.css";
import "./SettingsModal.css";
import type { UserSettings } from "../../../types";

export const SettingsModal: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const userContext = useContext(UserContext);
  const [isOpen, setIsOpen] = useMediatorState(userContext.isSettingsModalOpen);
  const [user] = useMediatorState(userContext.user);

  const [currentSelectedLanguage, setCurrentSelectedLanguage] = useState(() => {
    const settings = user ? CookieService.getSettingsCookie(user.id) : null;
    return settings?.lang || i18n.language;
  });
  const [currentSelectedTheme, setCurrentSelectedTheme] = useState(() => {
    const settings = user ? CookieService.getSettingsCookie(user.id) : null;
    return settings?.theme || theme;
  });
  const [persistFavourites, setPersistFavourites] = useState(
    () => localStorage.getItem("persist_favourites") === "true",
  );
  const [persistLanguage, setPersistLanguage] = useState(
    () => localStorage.getItem("persist_language") === "true",
  );
  const [persistTheme, setPersistTheme] = useState(
    () => localStorage.getItem("persist_theme") === "true",
  );

  useEffect(() => {
    if (isOpen) {
      async function setLanguageAndTheme() {
        const settings = user ? CookieService.getSettingsCookie(user.id) : null;
        setCurrentSelectedLanguage(settings?.lang || i18n.language);
        setCurrentSelectedTheme(settings?.theme || theme);
      }
      void (async () => await setLanguageAndTheme());
    }
  }, [isOpen, i18n.language, theme, user]);

  if (!isOpen) return null;

  const handleSaveAndClose = () => {
    i18n.changeLanguage(currentSelectedLanguage);
    if (theme !== currentSelectedTheme) toggleTheme();

    localStorage.setItem("persist_favourites", String(persistFavourites));
    localStorage.setItem("persist_language", String(persistLanguage));
    localStorage.setItem("persist_theme", String(persistTheme));

    if (!user) {
      setIsOpen(false);
      return;
    }

    const currentSettings: UserSettings =
      CookieService.getSettingsCookie(user.id) || {};
    currentSettings.lang = persistLanguage
      ? (currentSelectedLanguage as "en" | "de")
      : undefined;
    currentSettings.theme = persistTheme
      ? (currentSelectedTheme as "dark" | "light")
      : undefined;

    if (!persistFavourites) delete currentSettings.favorites;

    CookieService.setSettingsCookie(user.id, currentSettings);
    setIsOpen(false);
  };

  const handleCloseModal = () => setIsOpen(false);

  return (
    <div className="modal-overlay" onClick={handleCloseModal}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={handleCloseModal}>
          ×
        </button>
        <h2>{t("settings.title")}</h2>

        <div className="settings-group">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={persistFavourites}
              onChange={(e) => setPersistFavourites(e.target.checked)}
            />
            <span>{t("settings.persistFavourites")}</span>
          </label>
        </div>

        <div className="settings-group">
          <div className="setting-row">
            <span>{t("settings.language")}</span>
            <select
              value={currentSelectedLanguage}
              onChange={(e) => setCurrentSelectedLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={persistLanguage}
              onChange={(e) => setPersistLanguage(e.target.checked)}
            />
            <span>{t("settings.persistLanguage")}</span>
          </label>
        </div>

        <div className="settings-group">
          <div className="setting-row">
            <span>{t("settings.theme")}</span>
            <button
              className="settings-action-button"
              onClick={() =>
                setCurrentSelectedTheme(
                  currentSelectedTheme === "light" ? "dark" : "light",
                )
              }
              style={{ margin: 0, width: "auto" }}
            >
              {currentSelectedTheme === "light"
                ? t("settings.light")
                : t("settings.dark")}
            </button>
          </div>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={persistTheme}
              onChange={(e) => setPersistTheme(e.target.checked)}
            />
            <span>{t("settings.persistTheme")}</span>
          </label>
        </div>

        <div style={{ marginTop: "2rem" }}>
          <button className="submit-btn" onClick={handleSaveAndClose}>
            {t("settings.saveAndClose")}
          </button>
        </div>
      </div>
    </div>
  );
};
