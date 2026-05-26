import React from "react";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

export const LanguageToggle: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "de" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <button
     className="settings-action-button"
      onClick={toggleLanguage}
      title={i18n.language === "en" ? "Switch to German" : "Auf Englisch umstellen"}
      aria-label="Switch language"
    >
      <Globe size={20} className="icon" />
      <span className="lang-text">{i18n.language.toUpperCase()}</span>
    </button>
  );
};