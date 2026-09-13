import Task from '../models/Task.js';

export const createTask = async (req, res, next) => {
  try {
    const { title, description, completed, priority, category, dueDate, imageUrl, tags } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'Task title is required.'
      });
    }

    const task = await Task.create({
      user: req.user ? req.user._id : undefined,
      title,
      description: description || '',
      completed: completed !== undefined ? completed : false,
      priority: priority || 'medium',
      category: category || 'General',
      dueDate: dueDate || undefined,
      imageUrl: imageUrl || '',
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : [])
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully!',
      data: task
    });
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const { status, priority, category, search, userScoped } = req.query;

    const query = {};

    // Filter by User if specified or authenticated
    if (userScoped === 'true' && req.user) {
      query.user = req.user._id;
    }

    // Filter by Completion Status
    if (status === 'completed') {
      query.completed = true;
    } else if (status === 'pending') {
      query.completed = false;
    }

    // Filter by Priority
    if (priority && ['low', 'medium', 'high'].includes(priority.toLowerCase())) {
      query.priority = priority.toLowerCase();
    }

    // Filter by Category
    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(category, 'i') };
    }

    // Search Query (title, description, tags)
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { tags: searchRegex }
      ];
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: `Task not found with id of ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: `Task not found with invalid id of ${req.params.id}`
      });
    }
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { title, description, completed, priority, category, dueDate, imageUrl, tags } = req.body;

    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: `Task not found with id of ${req.params.id}`
      });
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (completed !== undefined) task.completed = completed;
    if (priority !== undefined) task.priority = priority;
    if (category !== undefined) task.category = category;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (imageUrl !== undefined) task.imageUrl = imageUrl;
    if (tags !== undefined) {
      task.tags = Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []);
    }

    const updatedTask = await task.save();

    res.status(200).json({
      success: true,
      message: 'Task updated successfully!',
      data: updatedTask
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: `Task not found with invalid id of ${req.params.id}`
      });
    }
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: `Task not found with id of ${req.params.id}`
      });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully!',
      deletedId: req.params.id
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: `Task not found with invalid id of ${req.params.id}`
      });
    }
    next(error);
  }
};
