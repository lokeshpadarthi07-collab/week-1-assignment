import Task from '../models/Task.js';

export const createTask = async (req, res, next) => {
  try {
    const { title, description, completed, priority } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'Task title is required.'
      });
    }

    const task = await Task.create({
      title,
      description: description || '',
      completed: completed !== undefined ? completed : false,
      priority: priority || 'medium'
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
    const tasks = await Task.find().sort({ createdAt: -1 });

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
    const { title, description, completed, priority } = req.body;

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
