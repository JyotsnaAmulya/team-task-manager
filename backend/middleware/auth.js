import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

export const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      req.user = decoded;
      logger.debug(`Token verified for user ID: ${decoded.id}`);
      next();
    } catch (error) {
      logger.warn(`Token verification failed: ${error.message}`);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    logger.warn('No token provided in authorization header');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    logger.warn(`Unauthorized Admin access attempt by user ID: ${req.user?.id}`);
    res.status(403).json({ message: 'Not authorized as an Admin' });
  }
};
