import React from 'react';
import { Heart, Clock, Eye, ArrowUpRight, Bookmark } from 'lucide-react';
import Button from './Button';

/**
 * Reusable Post Card Component
 */
export const Card = ({
  post,
  onSelect,
  onLike,
  isLiked = false,
  onBookmark,
  isBookmarked = false
}) => {
  const {
    id,
    title,
    excerpt,
    category,
    author,
    date,
    readTime,
    imageUrl,
    likes,
    views,
    featured
  } = post;

  return (
    <article className={`blog-card glass-card ${featured ? 'card-featured' : ''}`}>
      <div className="card-image-container" onClick={() => onSelect(post)}>
        <img src={imageUrl} alt={title} className="card-image" loading="lazy" />
        <div className="card-category-badge">{category}</div>
        {featured && <span className="card-featured-badge">Featured</span>}
        <button
          className={`card-bookmark-btn ${isBookmarked ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            if (onBookmark) onBookmark(id);
          }}
          title={isBookmarked ? 'Remove Bookmark' : 'Save for Later'}
          aria-label="Bookmark post"
        >
          <Bookmark size={15} fill={isBookmarked ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="card-body">
        <div className="card-meta">
          <span className="card-meta-item">
            <Clock size={14} />
            {readTime}
          </span>
          <span className="card-meta-item">
            <Eye size={14} />
            {views.toLocaleString()} views
          </span>
        </div>

        <h3 className="card-title" onClick={() => onSelect(post)}>
          {title}
        </h3>

        <p className="card-excerpt">{excerpt}</p>

        <div className="card-author">
          <img src={author.avatar} alt={author.name} className="author-avatar" />
          <div className="author-details">
            <span className="author-name">{author.name}</span>
            <span className="author-date">{date}</span>
          </div>
        </div>

        <div className="card-footer">
          <Button
            variant={isLiked ? 'secondary' : 'ghost'}
            size="sm"
            icon={Heart}
            className={isLiked ? 'liked-btn' : ''}
            onClick={(e) => {
              e.stopPropagation();
              onLike(id);
            }}
          >
            {likes + (isLiked ? 1 : 0)}
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={ArrowUpRight}
            onClick={() => onSelect(post)}
          >
            Read Post
          </Button>
        </div>
      </div>
    </article>
  );
};

export default Card;
