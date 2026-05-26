import React from "react";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

export const LanguageToggle: React.FC = () => {
  const {t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "de" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      
         className="header-button header-action-button language-toggle"
      onClick={toggleLanguage}
      title={i18n.language === "en" ? t("ariaLabels.switchGerman") : t("ariaLabels.switchEnglish")}
      aria-label={t("ariaLabels.switchLanguage")}
    >
      <Globe size={20} className="icon" />
      <span className="lang-text">{i18n.language.toUpperCase()}</span>
    </button>
  );
};