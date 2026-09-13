import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_react_blog_2026');

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'User associated with this token no longer exists.'
        });
      }

      return next();
    } catch (error) {
      console.error('JWT Authentication Error:', error.message);
      return res.status(401).json({
        success: false,
        error: 'Not authorized: Invalid or expired token.'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized: No token provided in Authorization header.'
    });
  }
};

export const optionalProtect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_react_blog_2026');
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Pass without error if token is invalid or expired
    }
  }

  next();
};
