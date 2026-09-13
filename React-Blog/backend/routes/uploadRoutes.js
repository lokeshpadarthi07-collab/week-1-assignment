import express from 'express';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/upload
 * @desc    Upload an image file using Multer
 * @access  Public
 */
router.post('/', (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          error: 'File size exceeds maximum limit of 5MB.'
        });
      }
      return res.status(400).json({
        success: false,
        error: err.message || 'File upload failed.'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please select an image file to upload.'
      });
    }

    const host = req.get('host');
    const protocol = req.protocol;
    const fileUrl = `/uploads/${req.file.filename}`;
    const fullUrl = `${protocol}://${host}${fileUrl}`;

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully!',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        url: fileUrl,
        fullUrl
      }
    });
  });
});

export default router;
