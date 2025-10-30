import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { LoginPage } from './components/LoginPage';
import { DashboardPage } from './components/DashboardPage';
import { SurveysPage } from './components/SurveysPage';
import { ResultsPage } from './components/ResultsPage';
import { RespondPage } from './components/RespondPage';
import { ReportsPage } from './components/ReportsPage';
import { FeedbackPage } from './components/FeedbackPage';
import { SettingsPage } from './components/SettingsPage';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Load theme from localStorage or default to light
    const savedTheme = localStorage.getItem('byteneko-theme');
    return (savedTheme === 'dark' ? 'dark' : 'light') as 'light' | 'dark';
  });

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('byteneko-theme', theme);
  }, [theme]);

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage}
        onLogout={() => setIsLoggedIn(false)}
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