import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import ImagePreview from '../components/ImagePreview';
import Button from '../components/Button';
import {
  PlusCircle,
  Search,
  SlidersHorizontal,
  CheckCircle2,
  Clock,
  AlertOctagon,
  ListTodo,
  X,
  Filter,
  Sparkles,
  Calendar,
  Tag,
  FileText,
  UploadCloud
} from 'lucide-react';

export function TaskManager({ showToast }) {
  const { user, isAuthenticated, token, API_BASE_URL } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, pending, completed
  const [priorityFilter, setPriorityFilter] = useState('all'); // all, high, medium, low
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [userOnlyFilter, setUserOnlyFilter] = useState(false);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewingImage, setViewingImage] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'Work',
    dueDate: '',
    imageUrl: '',
    tags: ''
  });

  const baseApiUrl = API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Fetch Tasks from Backend
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (statusFilter !== 'all') queryParams.append('status', statusFilter);
      if (priorityFilter !== 'all') queryParams.append('priority', priorityFilter);
      if (categoryFilter !== 'all') queryParams.append('category', categoryFilter);
      if (searchQuery.trim()) queryParams.append('search', searchQuery.trim());
      if (userOnlyFilter && isAuthenticated) queryParams.append('userScoped', 'true');

      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${baseApiUrl}/api/tasks?${queryParams.toString()}`, { headers });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to fetch tasks');

      if (Array.isArray(data.data)) {
        setTasks(data.data);
      }
    } catch (err) {
      console.warn('Backend API offline or error, running in local state mode:', err);
      setError('Running in local fallback mode. Backend API connection offline.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [statusFilter, priorityFilter, categoryFilter, searchQuery, userOnlyFilter, token]);

  // Derive Categories Dynamically
  const availableCategories = useMemo(() => {
    const defaultCats = ['Work', 'Personal', 'Study', 'Health', 'Finance', 'General'];
    const customCats = tasks.map((t) => t.category).filter(Boolean);
    return Array.from(new Set([...defaultCats, ...customCats]));
  }, [tasks]);

  // Statistics Calculations
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const highPriority = tasks.filter((t) => t.priority === 'high' && !t.completed).length;
    return { total, completed, pending, highPriority };
  }, [tasks]);

  // Handlers
  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      category: 'Work',
      dueDate: '',
      imageUrl: '',
      tags: ''
    });
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title || '',
      description: task.description || '',
      priority: task.priority || 'medium',
      category: task.category || 'Work',
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      imageUrl: task.imageUrl || '',
      tags: Array.isArray(task.tags) ? task.tags.join(', ') : (task.tags || '')
    });
    setIsCreateModalOpen(true);
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      category: formData.category,
      dueDate: formData.dueDate || undefined,
      imageUrl: formData.imageUrl,
      tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()) : []
    };

    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      if (editingTask) {
        // PUT update task
        const res = await fetch(`${baseApiUrl}/api/tasks/${editingTask._id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update task');

        setTasks((prev) => prev.map((t) => (t._id === editingTask._id ? data.data : t)));
        showToast('✅ Task updated successfully!');
      } else {
        // POST create task
        const res = await fetch(`${baseApiUrl}/api/tasks`, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create task');

        setTasks((prev) => [data.data, ...prev]);
        showToast('🚀 New task created!');
      }
    } catch (err) {
      console.warn('Backend update failed, applying to local state:', err);
      if (editingTask) {
        setTasks((prev) =>
          prev.map((t) => (t._id === editingTask._id ? { ...t, ...payload } : t))
        );
      } else {
        const newTask = {
          _id: `local-${Date.now()}`,
          ...payload,
          completed: false,
          createdAt: new Date().toISOString()
        };
        setTasks((prev) => [newTask, ...prev]);
      }
      showToast('Task saved (local mode)!');
    }

    setIsCreateModalOpen(false);
  };

  const handleToggleComplete = async (taskId, nextCompletedState) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, completed: nextCompletedState } : t))
    );

    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      await fetch(`${baseApiUrl}/api/tasks/${taskId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ completed: nextCompletedState })
      });
      showToast(nextCompletedState ? '🎉 Task marked as completed!' : 'Task marked as pending');
    } catch (err) {
      console.warn('Failed to sync completion with backend:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    setTasks((prev) => prev.filter((t) => t._id !== taskId));

    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      await fetch(`${baseApiUrl}/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers
      });
      showToast('🗑️ Task deleted successfully!');
    } catch (err) {
      console.warn('Failed to sync delete with backend:', err);
    }
  };

  return (
    <div className="task-manager-page">
      <div className="container">
        {/* Banner Section */}
        <section className="page-header-banner glass-card">
          <div className="banner-content">
            <div className="badge-pill">
              <Sparkles size={14} /> Full Stack Week 2 & Mini Project
            </div>
            <h1 className="page-title">Task Manager Application</h1>
            <p className="page-subtitle">
              Complete task tracking web app with Express REST API, Mongoose MongoDB storage, JWT Authentication, and Multer file upload integration.
            </p>
          </div>

          <div className="banner-action">
            <Button variant="primary" size="lg" icon={PlusCircle} onClick={handleOpenCreateModal}>
              Add New Task
            </Button>
          </div>
        </section>

        {/* Stats Row */}
        <div className="stats-cards-grid">
          <div className="stat-card glass-card">
            <div className="stat-icon-bg icon-blue">
              <ListTodo size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Total Tasks</span>
            </div>
          </div>

          <div className="stat-card glass-card">
            <div className="stat-icon-bg icon-green">
              <CheckCircle2 size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.completed}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>

          <div className="stat-card glass-card">
            <div className="stat-icon-bg icon-amber">
              <Clock size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.pending}</span>
              <span className="stat-label">Pending</span>
            </div>
          </div>

          <div className="stat-card glass-card">
            <div className="stat-icon-bg icon-pink">
              <AlertOctagon size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.highPriority}</span>
              <span className="stat-label">High Priority</span>
            </div>
          </div>
        </div>

        {/* Controls & Filters Bar */}
        <div className="controls-toolbar glass-card">
          {/* Search Box */}
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search tasks by title, category, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-field"
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="filter-dropdowns-group">
            {/* Status Pills */}
            <div className="status-filter-pills">
              <button
                className={`filter-pill ${statusFilter === 'all' ? 'active' : ''}`}
                onClick={() => setStatusFilter('all')}
              >
                All
              </button>
              <button
                className={`filter-pill ${statusFilter === 'pending' ? 'active' : ''}`}
                onClick={() => setStatusFilter('pending')}
              >
                Pending
              </button>
              <button
                className={`filter-pill ${statusFilter === 'completed' ? 'active' : ''}`}
                onClick={() => setStatusFilter('completed')}
              >
                Completed
              </button>
            </div>

            {/* Priority Select */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">Priority: All</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>

            {/* Category Select */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">Category: All</option>
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Task Cards Grid */}
        {loading ? (
          <div className="loading-state glass-card">
            <div className="spinner"></div>
            <p>Loading tasks from MongoDB Express REST API...</p>
          </div>
        ) : tasks.length > 0 ? (
          <div className="tasks-grid">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteTask}
                onViewImage={setViewingImage}
                API_BASE_URL={baseApiUrl}
              />
            ))}
          </div>
        ) : (
          <div className="empty-tasks-state glass-card">
            <div className="empty-icon-circle">
              <ListTodo size={40} />
            </div>
            <h3>No tasks found</h3>
            <p>Try adjusting your search criteria or add your first task to get started!</p>
            <Button variant="primary" icon={PlusCircle} onClick={handleOpenCreateModal}>
              Create New Task
            </Button>
          </div>
        )}
      </div>

      {/* Create / Edit Task Modal */}
      {isCreateModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsCreateModalOpen(false)}>
          <div className="modal-content glass-card task-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setIsCreateModalOpen(false)}>
              <X size={20} />
            </button>

            <div className="modal-header">
              <h2>{editingTask ? 'Edit Task' : 'Create New Task'}</h2>
              <p>Add task details, assign priority, and attach images using Multer upload.</p>
            </div>

            <form onSubmit={handleSaveTask} className="task-form">
              <div className="form-group">
                <label>Task Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Implement Multer upload in Express server"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Task Description</label>
                <textarea
                  placeholder="Add detailed task notes or steps..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="form-textarea"
                />
              </div>

              <div className="form-row-2col">
                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="form-select"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <input
                    type="text"
                    placeholder="Work, Personal, Study..."
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row-2col">
                <div className="form-group">
                  <label>Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Tags (comma separated)</label>
                  <input
                    type="text"
                    placeholder="React, Multer, Express"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Multer Image Attachment Upload Section */}
              <div className="form-group">
                <label className="label-with-icon">
                  <UploadCloud size={16} /> Attached Image (Multer Upload)
                </label>
                <ImagePreview
                  API_BASE_URL={baseApiUrl}
                  onUploadSuccess={(uploadData) => {
                    setFormData((prev) => ({ ...prev, imageUrl: uploadData.url }));
                    showToast('Image uploaded and attached to task!');
                  }}
                />
                {formData.imageUrl && (
                  <div className="attached-url-badge">
                    <span>Attached: {formData.imageUrl}</span>
                  </div>
                )}
              </div>

              <div className="modal-actions-row">
                <Button type="submit" variant="primary" icon={PlusCircle}>
                  {editingTask ? 'Save Changes' : 'Create Task'}
                </Button>
                <Button variant="outline" type="button" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full-screen Attachment Lightbox Modal */}
      {viewingImage && (
        <div className="modal-backdrop" onClick={() => setViewingImage(null)}>
          <div className="modal-content glass-card image-lightbox" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setViewingImage(null)}>
              <X size={20} />
            </button>
            <img src={viewingImage} alt="Full resolution attachment" className="lightbox-img" />
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskManager;
