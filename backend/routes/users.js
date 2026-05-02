import express from 'express';
import User from '../models/User.js';
import { protect, admin } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Get all users (useful for assigning tasks and adding to projects)
router.get('/', protect, async (req, res) => {
  try {
    logger.debug(`Fetching all users (Request by user ID: ${req.user.id})`);
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    logger.error(`Error fetching users: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
});

export default router;
