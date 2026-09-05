import mongoose from 'mongoose';

// Task Schema Definition for Assignment 1 (To-Do List REST API)
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a task title'],
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    completed: {
      type: Boolean,
      default: false
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  },
  {
    timestamps: true
  }
);

const Task = mongoose.model('Task', taskSchema);
export default Task;
