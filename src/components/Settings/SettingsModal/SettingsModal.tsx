import React, { useContext, useCallback } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { useMediatorState } from "../../../hooks/useMediatorState";
import { useTranslation } from "react-i18next";
import { UserSettings } from "../../../types";
import { useTheme } from "../../../contexts/ThemeContext";
import "./SettingsModal.css";

export const SettingsModal: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const userContext = useContext(UserContext);
  const [isOpen, setIsOpen] = useMediatorState(userContext.isSettingsModalOpen);
  const [user] = useMediatorState(userContext.user);
  const [userSettings, setUserSettings] = useMediatorState(
    userContext.userSettings,
  );

  const handleSaveAndClose = useCallback(() => {
    i18n.changeLanguage(userSettings?.lang);
    if (theme !== userSettings?.theme) toggleTheme();

    if (!user) {
      setIsOpen(false);
      return;
    }

    setIsOpen(false);
  }, [
    i18n,
    setIsOpen,
    theme,
    toggleTheme,
    user,
    userSettings?.lang,
    userSettings?.theme,
  ]);
  if (!isOpen) return null;
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
              checked={userSettings?.persist_favourites || false}
              onChange={(e) =>
                setUserSettings({
                  ...userSettings,
                  persist_favourites: Boolean(e.target.checked),
                } as UserSettings)
              }
            />
            <span>{t("settings.persistFavourites")}</span>
          </label>
        </div>

        <div className="settings-group">
          <div className="setting-row">
            <span>{t("settings.language")}</span>
            <select
              value={userSettings?.lang}
              onChange={(e) => {
                setUserSettings({
                  ...userSettings,
                  lang: e.target.value,
                } as UserSettings);
                console.log("changed lang", {
                  ...userSettings,
                  lang: e.target.value,
                });
              }}
            >
              <option value="en">English</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={userSettings?.persist_language || false}
              onChange={(e) =>
                setUserSettings({
                  ...userSettings,
                  persist_language: Boolean(e.target.checked),
                } as UserSettings)
              }
            />
            <span>{t("settings.persistLanguage")}</span>
          </label>
        </div>

        <div className="settings-group">
          <div className="setting-row">
            <span>{t("settings.theme")}</span>
            <button
              className="settings-action-button"
              data-variant={userSettings?.theme || "light"}
              onClick={() => {
                setUserSettings({
                  ...userSettings,
                  theme: userSettings?.theme === "light" ? "dark" : "light",
                } as UserSettings);
              }}
              style={{ margin: 0, width: "auto" }}
            >
              {userSettings?.theme === "light"
                ? t("settings.light")
                : t("settings.dark")}
            </button>
          </div>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={userSettings?.persist_theme || false}
              onChange={(e) =>
                setUserSettings({
                  ...userSettings,
                  persist_theme: Boolean(e.target.checked),
                } as UserSettings)
              }
            />
            <span>{t("settings.persistTheme")}</span>
          </label>
        </div>

        <div style={{ marginTop: "2rem" }}>
          <button
            className="submit-btn"
            data-variant="primary"
            onClick={handleSaveAndClose}
          >
            {t("settings.saveAndClose")}
          </button>
        </div>
      </div>
    </div>
  );
};
