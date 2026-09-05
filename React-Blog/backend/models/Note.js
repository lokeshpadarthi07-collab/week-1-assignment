import mongoose from 'mongoose';

// Note Schema Definition for Mini Project (Notes App Backend)
const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a note title'],
      trim: true
    },
    content: {
      type: String,
      required: [true, 'Please provide content for the note']
    },
    category: {
      type: String,
      trim: true,
      default: 'General'
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

const Note = mongoose.model('Note', noteSchema);
export default Note;
