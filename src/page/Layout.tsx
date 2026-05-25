import React from "react";
import { Header } from "./Header/Header";
import { Footer } from "./Footer";
import { LoginModal } from "../components/Auth/LoginModal";
import { SettingsModal } from "../components/Settings/SettingsModal/SettingsModal";
import { CookieBanner } from "../components/CookieBanner/CookieBanner";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="app-layout">
      <header className="layout-header">
        <Header />
      </header>
      <main className="layout-main">
        {children}
        <Footer />
      </main>
      <LoginModal />
      <SettingsModal />
      <CookieBanner />
    </div>
  );
};
