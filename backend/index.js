import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import workerRoutes from './routes/workerRoutes.js';
import workerDashboardRoutes from './routes/workerDashboardRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import performanceRoutes from './routes/performanceRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import sendError from './utils/errorResponse.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // For now allow all to fix the CORS blocker while we debug
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Debug Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/worker-dashboard', workerDashboardRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reports', reportRoutes);

app.get('/', (req, res) => {
  res.send('Backend API is running...');
});

// 404 Handler
app.use((req, res, next) => {
  sendError(res, 404, `The requested path (${req.url}) was not found.`);
});

// Error Handler
app.use((err, req, res, next) => {
  sendError(res, 500, null, err);
});

// Database Connection
const dbURI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!dbURI) {
  console.error('CRITICAL: No MongoDB URI found! Please check MONGODB_URI or MONGO_URI in environment variables.');
} else {
  const sanitizedURI = dbURI.replace(/:([^@]+)@/, ':****@');
  console.log(`Attempting to connect to MongoDB using ${process.env.MONGODB_URI ? 'MONGODB_URI' : 'MONGO_URI'}...`);
  console.log(`URI Scheme check: "${dbURI.substring(0, 10)}..."`);

  mongoose.connect(dbURI)
    .then(() => console.log('Successfully connected to MongoDB Atlas'))
    .catch(err => {
      console.error('CRITICAL: MongoDB connection error:', err.message);
    });
}

mongoose.connection.on('connected', () => console.log('Mongoose default connection open'));
mongoose.connection.on('error', (err) => console.log('Mongoose default connection error: ' + err));
mongoose.connection.on('disconnected', () => console.log('Mongoose default connection disconnected'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} (ES Modules)`);
});
