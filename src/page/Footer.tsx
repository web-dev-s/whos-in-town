import React from 'react';
import { useTranslation } from "react-i18next";
import { useElementHeight } from "../hooks/useElementHeight";
import { useViewportElement } from "../hooks/useViewportElement";

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  
  const footerRef = useElementHeight('--height-footer', "app-layout");
  useViewportElement('app-footer', 'footervisible', 'app-layout');

  return (
    <div id="app-footer" className="footer-content" ref={footerRef}>
      <p>{t('footer.text', { year: new Date().getFullYear() })}</p>
    </div>
  );
};