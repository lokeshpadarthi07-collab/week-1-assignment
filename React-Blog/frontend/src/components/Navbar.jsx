import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  CheckSquare,
  UploadCloud,
  BookOpen,
  User,
  LogOut,
  LogIn,
  UserPlus,
  Sun,
  Moon
} from 'lucide-react';
import Button from './Button';

export function Navbar({ theme, onToggleTheme }) {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="main-header glass-nav">
      <div className="container header-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo">
          <div className="logo-icon-wrapper">
            <CheckSquare size={22} className="brand-icon" />
          </div>
          <div className="brand-text">
            <span className="brand-name">TaskFlow</span>
            <span className="brand-badge">PRO</span>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="nav-links">
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            <CheckSquare size={16} />
            <span>Task Manager</span>
          </Link>

          <Link
            to="/upload"
            className={`nav-link ${isActive('/upload') ? 'active' : ''}`}
          >
            <UploadCloud size={16} />
            <span>Image Upload</span>
          </Link>

          <Link
            to="/blog"
            className={`nav-link ${isActive('/blog') ? 'active' : ''}`}
          >
            <BookOpen size={16} />
            <span>Tech Blog</span>
          </Link>
        </nav>

        {/* Right Header Actions */}
        <div className="header-actions">
          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="theme-toggle-btn"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* User Auth Section */}
          {isAuthenticated ? (
            <div className="user-profile-menu">
              <div className="user-avatar-badge">
                <User size={14} />
                <span className="user-name">{user?.name || 'User'}</span>
              </div>

              <button
                onClick={logout}
                className="logout-btn"
                title="Log Out"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="auth-buttons-group">
              <Link to="/login">
                <Button variant="outline" size="sm" icon={LogIn}>
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm" icon={UserPlus}>
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
