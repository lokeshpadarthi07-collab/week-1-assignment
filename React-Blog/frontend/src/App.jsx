import React, { useState, useMemo, useEffect } from 'react';
import initialPosts from './data/posts.json';
import Header from './components/Header';
import Footer from './components/Footer';
import Card from './components/Card';
import Button from './components/Button';
import Form from './components/Form';
import {
  Sparkles,
  SlidersHorizontal,
  X,
  Search,
  BookOpen,
  Calendar,
  User,
  Heart,
  Eye,
  Clock,
  PlusCircle,
  FileText,
  Tag,
  Share2,
  MessageSquare,
  Bookmark,
  Send
} from 'lucide-react';
import './App.css';

export function App() {
  // 1. Core State
  const [posts, setPosts] = useState(initialPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('latest');
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set());
  const [theme, setTheme] = useState('dark');
  const [activePost, setActivePost] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Comments state mapped by postId -> array of comment objects
  const [commentsMap, setCommentsMap] = useState({
    1: [
      { id: 101, author: 'Alex Johnson', text: 'React 19 Server Components completely revolutionized our initial page render times!', date: '2 hours ago' },
      { id: 102, author: 'Priya Sharma', text: 'Great breakdown on useActionState! Very helpful explanation.', date: '1 hour ago' }
    ]
  });
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentAuthor, setNewCommentAuthor] = useState('');

  // API Base URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Sync theme to root element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Fetch posts from backend API if available
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/posts`)
      .then((res) => {
        if (!res.ok) throw new Error('API server returned error status');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPosts(data);
        }
      })
      .catch((err) => {
        console.warn('Backend API connection offline or unreached, running in local fallback mode:', err);
      });
  }, [API_BASE_URL]);

  // Derive Categories dynamically
  const categories = useMemo(() => {
    const cats = new Set(posts.map((p) => p.category));
    return Array.from(cats);
  }, [posts]);

  // Toast Notification Helper
  const showToast = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // 2. Filter & Search & Sort Logic
  const filteredPosts = useMemo(() => {
    return posts
      .filter((post) => {
        // Bookmarked Filter
        if (selectedCategory === 'Saved') {
          return bookmarkedPosts.has(post.id);
        }

        // Category Filter
        const matchesCategory =
          selectedCategory === 'All' || post.category === selectedCategory;

        // Search Filter
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.category.toLowerCase().includes(query) ||
          (post.tags && post.tags.some((tag) => tag.toLowerCase().includes(query)));

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return b.likes - a.likes;
        if (sortBy === 'readTime') return parseInt(a.readTime) - parseInt(b.readTime);
        return b.id - a.id;
      });
  }, [posts, searchQuery, selectedCategory, sortBy, bookmarkedPosts]);

  // Featured Post
  const featuredPost = useMemo(() => {
    return posts.find((p) => p.featured) || posts[0];
  }, [posts]);

  // 3. Handlers
  const handleLikePost = (id) => {
    const isAlreadyLiked = likedPosts.has(id);

    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        showToast('Removed from liked posts');
      } else {
        next.add(id);
        showToast('Liked post! ❤️');
      }
      return next;
    });

    fetch(`${API_BASE_URL}/api/posts/${id}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isLiked: isAlreadyLiked })
    })
      .then((res) => res.json())
      .then((updated) => {
        setPosts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, likes: updated.likes } : p))
        );
      })
      .catch((err) => console.warn('Could not sync like with backend:', err));
  };

  const handleBookmarkPost = (id) => {
    setBookmarkedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        showToast('Removed from bookmarks');
      } else {
        next.add(id);
        showToast('Bookmarked post! 🔖');
      }
      return next;
    });
  };

  const handleSharePost = (post) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('🔗 Article link copied to clipboard!');
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim() || !activePost) return;

    const author = newCommentAuthor.trim() || 'Community Reader';
    const text = newCommentText.trim();

    const comment = {
      id: Date.now(),
      author,
      text,
      date: 'Just now'
    };

    setCommentsMap((prev) => ({
      ...prev,
      [activePost.id]: [...(prev[activePost.id] || []), comment]
    }));

    fetch(`${API_BASE_URL}/api/posts/${activePost.id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author, text })
    }).catch((err) => console.warn('Could not sync comment with backend:', err));

    setNewCommentText('');
    showToast('💬 Comment posted!');
  };

  const handleCreatePost = (formData) => {
    const payload = {
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content || formData.excerpt,
      category: formData.category || 'React',
      authorName: formData.authorName || 'Guest Contributor',
      authorRole: 'Community Writer',
      readTime: Math.ceil((formData.content?.length || 200) / 300),
      tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()) : ['React', 'Web'],
      imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80'
    };

    fetch(`${API_BASE_URL}/api/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then((res) => res.json())
      .then((newPost) => {
        setPosts((prev) => [newPost, ...prev]);
      })
      .catch((err) => {
        console.warn('Backend API connection offline, creating post in local state:', err);
        const fallbackPost = {
          id: Date.now(),
          title: formData.title,
          excerpt: formData.excerpt,
          content: formData.content || formData.excerpt,
          category: formData.category || 'React',
          author: {
            name: formData.authorName || 'Guest Contributor',
            role: 'Community Writer',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
          },
          date: 'Just now',
          readTime: `${Math.ceil((formData.content?.length || 200) / 300)} min read`,
          tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()) : ['React', 'Web'],
          imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
          likes: 0,
          views: 1,
          featured: false
        };
        setPosts((prev) => [fallbackPost, ...prev]);
      });

    setIsCreateModalOpen(false);
    showToast('🚀 Article published successfully!');
  };

  // Form Fields
  const createPostFields = [
    {
      name: 'title',
      label: 'Article Title',
      placeholder: 'e.g. Master React Custom Hooks in 10 Minutes',
      required: true,
      icon: FileText
    },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      options: ['React', 'Design System', 'AI & ML', 'Web Dev', 'Cloud'],
      required: true
    },
    {
      name: 'excerpt',
      label: 'Summary Excerpt',
      placeholder: 'A short catchy preview snippet for the blog card...',
      required: true
    },
    {
      name: 'content',
      label: 'Full Article Content',
      type: 'textarea',
      placeholder: 'Write your full article body here...',
      rows: 5,
      required: true
    },
    {
      name: 'authorName',
      label: 'Author Name',
      placeholder: 'Your name or alias',
      required: true,
      icon: User
    },
    {
      name: 'tags',
      label: 'Tags (comma separated)',
      placeholder: 'React, Hooks, Frontend',
      icon: Tag
    }
  ];

  return (
    <div className="app-root" data-theme={theme}>
      {/* Header Navigation */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        categories={categories}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        totalPostsCount={posts.length}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        bookmarkedCount={bookmarkedPosts.size}
      />

      {/* Main Content Area */}
      <main className="main-content">
        <div className="container">
          {/* Toast Alert */}
          {notification && (
            <div className="toast-notification">
              <span>{notification}</span>
            </div>
          )}

          {/* Hero Featured Article (Shown when no search query is active and on All category) */}
          {!searchQuery && selectedCategory === 'All' && featuredPost && (
            <section className="featured-section">
              <div className="featured-card glass-card">
                <div className="featured-image-col">
                  <img src={featuredPost.imageUrl} alt={featuredPost.title} />
                  <span className="featured-badge">
                    <Sparkles size={14} /> Featured Article
                  </span>
                </div>

                <div className="featured-content-col">
                  <span className="featured-category">{featuredPost.category}</span>
                  <h1 className="featured-title">{featuredPost.title}</h1>
                  <p className="featured-excerpt">{featuredPost.excerpt}</p>

                  <div className="featured-author-row">
                    <img src={featuredPost.author.avatar} alt={featuredPost.author.name} />
                    <div>
                      <span className="author-name">{featuredPost.author.name}</span>
                      <span className="author-role">{featuredPost.author.role}</span>
                    </div>
                    <span className="featured-date">• {featuredPost.date}</span>
                  </div>

                  <div className="featured-actions">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => setActivePost(featuredPost)}
                    >
                      Read Featured Story
                    </Button>
                    <Button
                      variant={likedPosts.has(featuredPost.id) ? 'secondary' : 'outline'}
                      size="lg"
                      icon={Heart}
                      onClick={() => handleLikePost(featuredPost.id)}
                    >
                      {featuredPost.likes + (likedPosts.has(featuredPost.id) ? 1 : 0)} Likes
                    </Button>
                    <Button
                      variant={bookmarkedPosts.has(featuredPost.id) ? 'secondary' : 'outline'}
                      size="lg"
                      icon={Bookmark}
                      onClick={() => handleBookmarkPost(featuredPost.id)}
                    >
                      {bookmarkedPosts.has(featuredPost.id) ? 'Saved' : 'Save'}
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Controls Bar: Results Count & Sorting */}
          <div className="controls-bar">
            <div className="results-info">
              <h2 className="section-heading">
                {selectedCategory === 'All'
                  ? 'Latest Articles'
                  : selectedCategory === 'Saved'
                  ? 'Bookmarked Articles'
                  : `${selectedCategory} Articles`}
              </h2>
              <span className="results-count">
                Showing {filteredPosts.length} of {posts.length} posts
              </span>
            </div>

            <div className="sort-controls">
              <SlidersHorizontal size={16} className="sort-icon" />
              <label htmlFor="sort-select">Sort by:</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-dropdown"
              >
                <option value="latest">Latest Published</option>
                <option value="popular">Most Liked</option>
                <option value="readTime">Quickest Read</option>
              </select>
            </div>
          </div>

          {/* Blog Cards Grid */}
          {filteredPosts.length > 0 ? (
            <div className="cards-grid">
              {filteredPosts.map((post) => (
                <Card
                  key={post.id}
                  post={post}
                  onSelect={setActivePost}
                  onLike={handleLikePost}
                  isLiked={likedPosts.has(post.id)}
                  onBookmark={handleBookmarkPost}
                  isBookmarked={bookmarkedPosts.has(post.id)}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state glass-card">
              <div className="empty-icon-bg">
                <Search size={36} />
              </div>
              <h3>No articles found</h3>
              <p>
                {selectedCategory === 'Saved'
                  ? "You haven't bookmarked any articles yet. Click the bookmark icon on any post card to save it."
                  : `We couldn't find any articles matching "${searchQuery}". Try searching for another keyword or resetting filters.`}
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
              >
                Reset Search Filters
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Article Detail Reader Modal */}
      {activePost && (
        <div className="modal-backdrop" onClick={() => setActivePost(null)}>
          <div className="modal-content glass-card reader-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setActivePost(null)} aria-label="Close modal">
              <X size={20} />
            </button>

            <div className="reader-header">
              <span className="reader-category">{activePost.category}</span>
              <h2 className="reader-title">{activePost.title}</h2>

              <div className="reader-meta-row">
                <div className="reader-author">
                  <img src={activePost.author.avatar} alt={activePost.author.name} />
                  <div>
                    <span className="author-name">{activePost.author.name}</span>
                    <span className="author-role">{activePost.author.role}</span>
                  </div>
                </div>

                <div className="reader-stats">
                  <span><Calendar size={14} /> {activePost.date}</span>
                  <span><Clock size={14} /> {activePost.readTime}</span>
                  <span><Eye size={14} /> {activePost.views} views</span>
                </div>
              </div>
            </div>

            <div className="reader-banner-img">
              <img src={activePost.imageUrl} alt={activePost.title} />
            </div>

            <div className="reader-body">
              <p className="reader-lead">{activePost.excerpt}</p>
              <div className="reader-paragraphs">
                <p>{activePost.content}</p>
                <p>
                  Building production-grade user interfaces requires disciplined architectural choices. When structuring component hierarchies, always prioritize separation of concerns, single-responsibility modules, and predictable state data flows.
                </p>
              </div>

              <div className="reader-tags">
                {activePost.tags && activePost.tags.map((tag) => (
                  <span key={tag} className="tag-chip">#{tag}</span>
                ))}
              </div>

              {/* Reader Actions */}
              <div className="reader-actions-bar">
                <Button
                  variant={likedPosts.has(activePost.id) ? 'secondary' : 'outline'}
                  icon={Heart}
                  onClick={() => handleLikePost(activePost.id)}
                >
                  {activePost.likes + (likedPosts.has(activePost.id) ? 1 : 0)} Likes
                </Button>
                <Button
                  variant={bookmarkedPosts.has(activePost.id) ? 'secondary' : 'outline'}
                  icon={Bookmark}
                  onClick={() => handleBookmarkPost(activePost.id)}
                >
                  {bookmarkedPosts.has(activePost.id) ? 'Bookmarked' : 'Bookmark'}
                </Button>
                <Button
                  variant="outline"
                  icon={Share2}
                  onClick={() => handleSharePost(activePost)}
                >
                  Share Article
                </Button>
              </div>

              {/* Interactive Comments Section */}
              <div className="comments-section">
                <h4 className="comments-title">
                  <MessageSquare size={16} /> Reader Discussion ({(commentsMap[activePost.id] || []).length})
                </h4>

                <div className="comments-list">
                  {(commentsMap[activePost.id] || []).length > 0 ? (
                    (commentsMap[activePost.id] || []).map((c) => (
                      <div key={c.id} className="comment-item">
                        <div className="comment-header">
                          <span className="comment-author">{c.author}</span>
                          <span className="comment-date">{c.date}</span>
                        </div>
                        <p className="comment-text">{c.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="no-comments">No comments yet. Be the first to start the discussion!</p>
                  )}
                </div>

                <form className="add-comment-form" onSubmit={handleAddComment}>
                  <input
                    type="text"
                    placeholder="Your Name (optional)"
                    value={newCommentAuthor}
                    onChange={(e) => setNewCommentAuthor(e.target.value)}
                    className="comment-author-input"
                  />
                  <div className="comment-input-row">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      className="comment-text-input"
                      required
                    />
                    <Button type="submit" variant="primary" icon={Send} size="sm">
                      Post
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            <div className="reader-footer">
              <Button variant="primary" onClick={() => setActivePost(null)}>
                Done Reading
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Write Article Form Modal */}
      {isCreateModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsCreateModalOpen(false)}>
          <div className="modal-content glass-card form-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setIsCreateModalOpen(false)} aria-label="Close modal">
              <X size={20} />
            </button>

            <Form
              title="Publish New Article"
              description="Share your tech insights, React patterns, or engineering guides with the community."
              fields={createPostFields}
              onSubmit={handleCreatePost}
              submitText="Publish Article"
              submitIcon={PlusCircle}
              cancelText="Cancel"
              onCancel={() => setIsCreateModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer
        categories={categories}
        onCategorySelect={setSelectedCategory}
      />
    </div>
  );
}

export default App;
