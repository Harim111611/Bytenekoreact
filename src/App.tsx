import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardPage } from './components/DashboardPage';
import { SurveysPage } from './components/SurveysPage';
import { ResultsPage } from './components/ResultsPage';
import { RespondPage } from './components/RespondPage';
import { ReportsPage } from './components/ReportsPage';
import { FeedbackPage } from './components/FeedbackPage';
import { SettingsPage } from './components/SettingsPage';
import LoginPage from "./components/LoginPage";

import { api } from './lib/api';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('byteneko-theme');
    return (savedTheme === 'dark' ? 'dark' : 'light') as 'light' | 'dark';
  });

  // On mount: verify session with backend
  useEffect(() => {
    let cancelled = false;
    async function checkSession() {
      try {
        const meUrl = (import.meta as any).env.VITE_AUTH_USER_ENDPOINT || "/api/auth/me/";
        const r = await api.get(meUrl);
        if (!cancelled) setIsLoggedIn(!!r?.data);
      } catch {
        if (!cancelled) {
          api.logout();           // limpia tokens + authUser
          setIsLoggedIn(false);
        }
      }
    }
    checkSession();
    return () => { cancelled = true; };
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('byteneko-theme', theme);
  }, [theme]);

  const handleThemeChange = (newTheme: 'light' | 'dark') => setTheme(newTheme);

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={() => {
          api.logout();                 // ✅ borra access, refresh y authUser
          setIsLoggedIn(false);         // vuelve a LoginPage
          setCurrentPage('dashboard');  // opcional: resetea pestaña activa
          try { history.pushState(null, "", "/login"); } catch {}
        }}
      />

      <main className="flex-1 ml-[280px]">
        {currentPage === 'dashboard' && <DashboardPage />}
        {currentPage === 'surveys' && <SurveysPage />}
        {currentPage === 'results' && <ResultsPage />}
        {currentPage === 'respond' && <RespondPage />}
        {currentPage === 'reports' && <ReportsPage />}
        {currentPage === 'feedback' && <FeedbackPage />}
        {currentPage === 'settings' && (
          <SettingsPage theme={theme} onThemeChange={handleThemeChange} />
        )}
      </main>
    </div>
  );
}
