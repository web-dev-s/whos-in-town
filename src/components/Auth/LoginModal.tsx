import React, { useContext, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { useMediatorState } from "../../hooks/useMediatorState";
import { UserStorageService } from "../../api/userStorageService";
import { CookieService } from "../../api/cookieService";
import "./LoginModal.css";
import { useTranslation } from "react-i18next";
import { FavoritesContext } from "../../contexts/FavoritesContext";
import i18n from "../../providers/lang/i18n";
import { useTheme } from "../../contexts/ThemeContext";
import { UserSettings } from "../../types";

export const LoginModal: React.FC = () => {
  const { t } = useTranslation();
  const userContext = useContext(UserContext);
  const favoritesContext = useContext(FavoritesContext);

  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useMediatorState(userContext.isLoginModalOpen);

  const [isRegister, setIsRegister] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [highlightRegisterButton, setHighlightRegisterButton] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsOpen(false);
    setError("");
    setUserName("");
    setEmail("");
    setHighlightRegisterButton(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!userName || !email) {
      setError(t("messages.fillFields"));
      setHighlightRegisterButton(false);
      return;
    }

    const users = UserStorageService.getUsers();

    if (isRegister) {
      if (users.find((u) => u.email === email)) {
        setError(t("messages.userExists"));
        return;
      }
      setHighlightRegisterButton(false);

      const newUser = {
        id: users.length + 1 || 1,
        name: userName,
        email: email,
      };

      UserStorageService.saveUsers([...users, newUser]);
      CookieService.setUserSession(newUser);
      userContext.user.next(newUser);
      userContext.isAuthenticated.next(true);

      favoritesContext.favorites.next([]); // New user starts with empty favorites
      handleClose();
    } else {
      const foundUser = users.find(
        (u) => u.name === userName && u.email === email,
      );
      if (foundUser) {
        CookieService.setUserSession(foundUser);

        const userSettings = UserStorageService.getUserSettings<UserSettings>(
          foundUser.id.toString(),
        );
          console.log(
          "Loaded user settings in storage:",
          userSettings,
        );
        userContext.user.next(foundUser);
        userContext.userSettings.next(userSettings);
        userContext.isAuthenticated.next(true);
        if (userSettings?.favorites) {
          favoritesContext.favorites.next(userSettings.favorites);
        }
        if (userSettings?.lang) {
          i18n.changeLanguage(userSettings.lang);
        }
        if (userSettings?.theme && theme !== userSettings.theme) {
          toggleTheme();
        }
        console.log(
          "Loaded user settings from storage:",
          userContext.userSettings.getValue(),
        );

        handleClose();
        setHighlightRegisterButton(false);
      } else {
        setError(t("messages.userNotFound"));
        setHighlightRegisterButton(true);
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={handleClose}>
          ×
        </button>
        <h2>{isRegister ? t("buttons.register") : t("buttons.login")}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="userName">{t("labels.username")}</label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder={t("placeholders.enterUsername")}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">{t("labels.email")}</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("placeholders.enterEmail")}
            />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <button type="submit" className="submit-btn">
            {isRegister ? t("buttons.signUp") : t("buttons.signIn")}
          </button>
        </form>
        <div className="toggle-mode">
          <span>
            {isRegister
              ? t("messages.alreadyHaveAccount")
              : t("messages.dontHaveAccount")}
          </span>
          <button
            type="button"
            className={`link-btn ${highlightRegisterButton ? "highlight-register" : ""}`}
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
              setHighlightRegisterButton(false);
            }}
          >
            {isRegister ? t("buttons.login") : t("buttons.register")}
          </button>
        </div>
      </div>
    </div>
  );
};
