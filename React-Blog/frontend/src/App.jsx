import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TaskManager from './pages/TaskManager';
import ImageUploadSandbox from './pages/ImageUploadSandbox';
import BlogPage from './pages/BlogPage';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

export function AppContent() {
  const [theme, setTheme] = useState(() => localStorage.getItem('app_theme') || 'dark');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  const showToast = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="app-root" data-theme={theme}>
      {/* Shared Navigation Header */}
      <Navbar theme={theme} onToggleTheme={handleToggleTheme} />

      {/* Global Toast Alert */}
      {notification && (
        <div className="toast-notification">
          <span>{notification}</span>
        </div>
      )}

      {/* Main Content View Container */}
      <main className="main-content">
        <Routes>
          {/* Default Route: Full Stack Task Manager Application */}
          <Route path="/" element={<TaskManager showToast={showToast} />} />
          <Route path="/tasks" element={<Navigate to="/" replace />} />

          {/* Image Upload Feature Sandbox Page */}
          <Route path="/upload" element={<ImageUploadSandbox showToast={showToast} />} />

          {/* React Blog Platform Page */}
          <Route path="/blog" element={<BlogPage showToast={showToast} />} />

          {/* User Authentication Routes */}
          <Route path="/login" element={<Login showToast={showToast} />} />
          <Route path="/register" element={<Register showToast={showToast} />} />

          {/* Fallback Catch-All */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer Component */}
      <Footer categories={['React', 'Design System', 'AI & ML', 'Web Dev']} />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
