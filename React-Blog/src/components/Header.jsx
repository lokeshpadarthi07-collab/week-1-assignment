import React from 'react';
import { Search, PlusCircle, Sparkles, BookOpen, Layers, Bookmark, Sun, Moon } from 'lucide-react';
import Button from './Button';

/**
 * Reusable Header Component
 */
export const Header = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategorySelect,
  categories = [],
  onOpenCreateModal,
  totalPostsCount = 0,
  theme = 'dark',
  onToggleTheme,
  bookmarkedCount = 0
}) => {
  return (
    <header className="app-header">
      <div className="container header-container">
        <div className="brand-logo" onClick={() => onCategorySelect('All')}>
          <div className="logo-icon-bg">
            <Sparkles size={20} />
          </div>
          <div className="brand-text">
            <span className="brand-name">Dev<span className="text-highlight">Pulse</span></span>
            <span className="brand-tagline">React & Tech Engineering</span>
          </div>
        </div>

        <div className="header-search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search articles by title, tag, or keyword..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => onSearchChange('')}>
              ×
            </button>
          )}
        </div>

        <div className="header-actions">
          <button
            className="theme-toggle-header"
            onClick={onToggleTheme}
            title="Toggle Light / Dark Theme"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className="posts-count-badge">
            <BookOpen size={15} />
            <span>{totalPostsCount} Articles</span>
          </div>

          <Button
            variant="primary"
            size="md"
            icon={PlusCircle}
            onClick={onOpenCreateModal}
          >
            Write Article
          </Button>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <div className="category-bar">
        <div className="container category-container">
          <div className="category-scroll-wrapper">
            <button
              className={`cat-pill ${selectedCategory === 'All' ? 'active' : ''}`}
              onClick={() => onCategorySelect('All')}
            >
              <Layers size={14} />
              All Posts
            </button>

            <button
              className={`cat-pill ${selectedCategory === 'Saved' ? 'active' : ''}`}
              onClick={() => onCategorySelect('Saved')}
            >
              <Bookmark size={14} />
              Bookmarked ({bookmarkedCount})
            </button>

            {categories.map((cat) => (
              <button
                key={cat}
                className={`cat-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => onCategorySelect(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
