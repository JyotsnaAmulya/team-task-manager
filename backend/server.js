import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import taskRoutes from './routes/tasks.js';
import userRoutes from './routes/users.js';
import logger from './utils/logger.js';
import requestLogger from './middleware/requestLogger.js';

dotenv.config();

const app = express();

// ✅ Better CORS (handles Railway + local)
app.use(cors({
  origin: [
    "https://team-task-manager.up.railway.app",
    "https://team-task-manager-production-3417.up.railway.app",
    "https://team-task-manager-production-bb6b.up.railway.app",
    "http://localhost:3000",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(requestLogger);

// ✅ Routes (IMPORTANT: /api prefix)
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

// ✅ Health Check Endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  res.json({
    status: 'Healthy',
    uptime: process.uptime(),
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;

// ✅ Start server
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`🔥 Server running on port ${PORT}`);
});

// ✅ Connect DB
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000 // Timeout after 5 seconds instead of hanging
})
  .then(() => logger.info('✅ MongoDB connected'))
  .catch(err => {
    logger.error('❌ MongoDB connection error:', err.message);
    // On Railway, if DB fails, it's better to log it clearly
  });