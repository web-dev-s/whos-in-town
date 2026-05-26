import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CookieService } from "../../api/cookieService";
import "./CookieBanner.css";

export const CookieBanner: React.FC = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasConsent = CookieService.getCookieConsent();
    if (!hasConsent) {
      (() => {
        setIsVisible(true);
      })();
    }
  }, []);

  const handleAccept = () => {
    CookieService.setCookieConsent();
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-banner">
      <div className="cookie-banner-content">
        <p>{t("cookieBanner.text")}</p>
        <button className="cookie-accept-btn" onClick={handleAccept}>
          {t("cookieBanner.accept")}
        </button>
      </div>
    </div>
  );
};
