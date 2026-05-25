import React from 'react';
import { useTranslation } from "react-i18next";

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="footer-content">
      <p>{t('footer.text', { year: new Date().getFullYear() })}</p>
    </div>
  );
};