import express from 'express';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/upload
 * @desc    Upload an image file using Multer (Supports Local Disk & Vercel MemoryStorage)
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

    let fileUrl = '';
    const filename = req.file.filename || req.file.originalname;

    if (req.file.buffer) {
      // Memory Storage mode (Vercel Serverless) -> Convert to base64 Data URI
      const b64 = req.file.buffer.toString('base64');
      fileUrl = `data:${req.file.mimetype};base64,${b64}`;
    } else {
      // Disk Storage mode (Local Dev)
      fileUrl = `/uploads/${req.file.filename}`;
    }

    const host = req.get('host');
    const protocol = req.protocol;
    const fullUrl = fileUrl.startsWith('data:') ? fileUrl : `${protocol}://${host}${fileUrl}`;

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully!',
      data: {
        filename,
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
