
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

console.log(" Server initializing...");

// GLOBAL REQUEST LOGGER (VERY IMPORTANT)
app.use((req, res, next) => {
  console.log(` Request: ${req.method} ${req.url}`);
  console.log(" Origin Header:", req.headers.origin);
  next();
});

// CORS VERSIONs
app.use(cors({
  origin: function (origin, callback) {
    console.log(" Incoming Origin:", origin);

    const allowedOrigins = [
      process.env.FRONTEND_URL,
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:5174"
    ];

    if (!origin) {
      console.log(" No origin (Postman / server-to-server request)");
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      console.log(" CORS Allowed:", origin);
      callback(null, true);
    } else {
      console.log(" CORS Blocked:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

app.use(express.json());
app.use(requestLogger);

//  ROUTE LOGGING WRAPPER
const logRoute = (name) => (req, res, next) => {
  console.log(`Route Hit: ${name}`);
  next();
};

//  Routes
app.use('/api/auth', logRoute("AUTH"), authRoutes);
app.use('/api/projects', logRoute("PROJECTS"), projectRoutes);
app.use('/api/tasks', logRoute("TASKS"), taskRoutes);
app.use('/api/users', logRoute("USERS"), userRoutes);

//  Root check
app.get('/', (req, res) => {
  console.log("Root endpoint hit");
  res.send('API is running...');
});

//  Health check
app.get('/api/health', (req, res) => {
  console.log("Health check endpoint hit");

  const db = mongoose.connection;
  res.json({
    status: 'Healthy',
    version: '1.3-DB-CHECK',
    databaseName: db.name || 'Not Connected',
    connection: db.readyState === 1 ? 'Connected' : 'Disconnected',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;

//  Start server
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server running on port ${PORT}`);
  console.log(`Server running on port ${PORT}`);
});

//  MongoDB connection with logs
console.log("Connecting to MongoDB...");

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000
})
  .then(() => {
    logger.info('MongoDB connected');
    console.log('MongoDB connected');
  })
  .catch(err => {
    logger.error('MongoDB connection error:', err.message);
    console.log('MongoDB connection error:', err.message);
  });

//  GLOBAL ERROR HANDLER (VERY IMPORTANT)
app.use((err, req, res, next) => {
  console.error("Global Error:", err.message);

  res.status(500).json({
    message: err.message || "Internal Server Error"
  });
});