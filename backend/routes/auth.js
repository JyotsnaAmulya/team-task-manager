import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import logger from '../utils/logger.js';

const router = express.Router();

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '30d' });
};

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Log the request body (excluding password) for debugging
    logger.info(`Signup attempt - Name: ${name}, Email: ${email}, Role: ${role}`);

    if (!name || !email || !password) {
      logger.warn(`Signup failed: Missing fields for email: ${email}`);
      return res.status(400).json({ message: 'Please provide all required fields (name, email, password)' });
    }
    
    const userExists = await User.findOne({ email });

    if (userExists) {
      logger.warn(`Signup failed: User already exists for email: ${email}`);
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'Member'
    });

    if (user) {
      const token = generateToken(user._id, user.role);
      logger.info(`User signed up successfully: ${user.email} (${user.role})`);
      
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: token
      });
    } else {
      logger.error('Signup failed: Invalid user data');
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    logger.error(`Signup error: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    logger.info(`Login attempt for email: ${email}`);
    
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user._id, user.role);
      logger.info(`User logged in successfully: ${user.email}`);
      
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: token
      });
    } else {
      logger.warn(`Login failed: Invalid credentials for email: ${email}`);
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
});

export default router;
