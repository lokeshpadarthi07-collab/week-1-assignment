import Note from '../models/Note.js';

export const createNote = async (req, res, next) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error: 'Please provide both title and content for the note.'
      });
    }

    const note = await Note.create({
      title,
      content,
      category: category || 'General',
      user: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Note created successfully!',
      data: note
    });
  } catch (error) {
    next(error);
  }
};

export const getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    next(error);
  }
};

export const getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        error: `Note not found with id of ${req.params.id}`
      });
    }

    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Access denied: You do not have permission to access another user\'s note.'
      });
    }

    res.status(200).json({
      success: true,
      data: note
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: `Note not found with invalid id of ${req.params.id}`
      });
    }
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { title, content, category } = req.body;

    let note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        error: `Note not found with id of ${req.params.id}`
      });
    }

    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Access denied: You cannot update another user\'s note.'
      });
    }

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (category !== undefined) note.category = category;

    const updatedNote = await note.save();

    res.status(200).json({
      success: true,
      message: 'Note updated successfully!',
      data: updatedNote
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: `Note not found with invalid id of ${req.params.id}`
      });
    }
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        error: `Note not found with id of ${req.params.id}`
      });
    }

    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Access denied: You cannot delete another user\'s note.'
      });
    }

    await note.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully!',
      deletedId: req.params.id
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: `Note not found with invalid id of ${req.params.id}`
      });
    }
    next(error);
  }
};
