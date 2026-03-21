import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import hpp from 'hpp';
import xss from 'xss-clean';
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
import { enforcePagination } from './middleware/paginationMiddleware.js';
import { globalResponseSanitizer } from './middleware/sanitizerMiddleware.js';
import { queryGuard } from './middleware/queryGuard.js';
import { getSecurityStatus } from './controllers/securityController.js';

const app = express();
app.disable('x-powered-by'); // Framework-level technology concealment
app.set('etag', false); // Disable Etags to prevent cache-timing attacks
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"], 
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      connectSrc: ["'self'", "https://res.cloudinary.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
      requireTrustedTypesFor: ["'script'"],
      frameAncestors: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
  next();
});

// Global Response Sanitizer (Strip sensitive fields)
app.use(globalResponseSanitizer);

app.use(cookieParser()); // Necessary for HttpOnly cookies
app.use(mongoSanitize()); // Prevent NoSQL Injection
app.use(hpp()); // Prevent HTTP Parameter Pollution
app.use(xss()); // Sanitize user input from XSS
app.use(queryGuard); // Prevent NoSQL Query Pollution

// Anti-SSRF Shield (Block internal metadata IPs)
app.use((req, res, next) => {
  const internalIps = ['169.254.169.254', '127.0.0.1', '::1', '0.0.0.0'];
  const host = req.headers.host || '';
  if (internalIps.some(ip => host.includes(ip))) {
    return sendError(res, 403, 'Access to internal infrastructure is prohibited.');
  }
  next();
});

// Rate Limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per window
  message: 'Too many authentication attempts from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limit for data mutations (POST/PUT/DELETE)
const mutationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // Limit each IP to 100 mutations per hour
  message: 'Too many data modification requests from this IP. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Configure CORS
const allowedOrigins = [
  'http://localhost:3000',
  'https://jnnard.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow cookies to be sent
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Global Pagination Enforcer (GET requests)
app.use(enforcePagination);

// Debug Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/workers', mutationLimiter, workerRoutes);
app.use('/api/worker-dashboard', mutationLimiter, workerDashboardRoutes);
app.use('/api/projects', mutationLimiter, projectRoutes);
app.use('/api/tasks', mutationLimiter, taskRoutes);
app.use('/api/performance', mutationLimiter, performanceRoutes);
app.use('/api/upload', mutationLimiter, uploadRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reports', mutationLimiter, reportRoutes);

app.get('/', (req, res) => {
  res.send('Backend API is running...');
});

// Security Heartbeat (Admin Only)
app.get('/api/security/heartbeat', protect, admin, getSecurityStatus);

// 404 Handler - Stealth Mode
app.use((req, res, next) => {
  res.removeHeader('X-Powered-By');
  res.removeHeader('Server');
  sendError(res, 404, `The requested path was not found.`);
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

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} (ES Modules)`);
});

// Omega Singularity: Physical connection phase-lock
server.timeout = 30000; // 30s absolute timeout
server.keepAliveTimeout = 5000; // 5s idle keep-alive
server.headersTimeout = 6000; // 6s headers timeout

