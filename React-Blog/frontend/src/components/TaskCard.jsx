import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Calendar,
  Tag,
  Trash2,
  Edit3,
  Image as ImageIcon,
  ExternalLink,
  Clock,
  AlertCircle
} from 'lucide-react';
import Button from './Button';

export function TaskCard({ task, onToggleComplete, onEdit, onDelete, onViewImage, API_BASE_URL }) {
  const { _id, title, description, completed, priority, category, dueDate, imageUrl, tags } = task;

  const priorityColors = {
    high: 'priority-badge-high',
    medium: 'priority-badge-medium',
    low: 'priority-badge-low'
  };

  const getFullImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    const base = API_BASE_URL || 'http://localhost:5000';
    return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const formattedDate = dueDate
    ? new Date(dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null;

  return (
    <div className={`task-card glass-card ${completed ? 'completed-task' : ''}`}>
      <div className="task-card-header">
        {/* Checkbox Toggle */}
        <button
          onClick={() => onToggleComplete(_id, !completed)}
          className={`task-checkbox ${completed ? 'checked' : ''}`}
          title={completed ? 'Mark as pending' : 'Mark as completed'}
        >
          {completed ? (
            <CheckCircle2 className="check-icon checked-icon" size={22} />
          ) : (
            <Circle className="check-icon unchecked-icon" size={22} />
          )}
        </button>

        {/* Priority & Category Badges */}
        <div className="task-badges-row">
          <span className={`priority-badge ${priorityColors[priority] || priorityColors.medium}`}>
            {priority?.toUpperCase()}
          </span>
          {category && (
            <span className="category-chip">
              <Tag size={12} />
              {category}
            </span>
          )}
        </div>
      </div>

      {/* Task Content */}
      <div className="task-card-body">
        <h3 className={`task-title ${completed ? 'strikethrough' : ''}`}>{title}</h3>
        {description && <p className="task-description">{description}</p>}

        {/* Attached Image Thumbnail */}
        {imageUrl && (
          <div className="task-attachment-preview" onClick={() => onViewImage(getFullImageUrl(imageUrl))}>
            <img src={getFullImageUrl(imageUrl)} alt="Task attachment" className="attachment-thumbnail" />
            <div className="attachment-overlay">
              <ImageIcon size={16} />
              <span>View Attachment</span>
            </div>
          </div>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="task-tags-row">
            {tags.map((t, idx) => (
              <span key={idx} className="tag-chip">#{t}</span>
            ))}
          </div>
        )}
      </div>

      {/* Task Card Footer */}
      <div className="task-card-footer">
        {formattedDate ? (
          <div className="due-date-badge" title="Due Date">
            <Calendar size={14} />
            <span>{formattedDate}</span>
          </div>
        ) : (
          <span className="no-date-placeholder">No due date</span>
        )}

        <div className="task-card-actions">
          <button
            onClick={() => onEdit(task)}
            className="action-btn edit-btn"
            title="Edit Task"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={() => onDelete(_id)}
            className="action-btn delete-btn"
            title="Delete Task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
