import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes";
import passport from "passport";
import cookieSession from "cookie-session";
import { errorHandler, security } from "./middlewares";
import { swaggerDocs, swaggerDocsSetup } from "./docs/swagger";
import { schedulerUtil } from "./utils";
import { EnvironmentConfig } from "./config/environment";
import Logger from "./utils/logger";
import './config/passportGithub';
import './config/passportGoogle';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Trust proxy (important for Oracle Cloud/reverse proxy)
app.set('trust proxy', 1);

// Security middleware (apply first)
app.use(security.securityHeaders);
app.use(security.requestSizeLimiter);

// CORS configuration for production
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    const allowedOrigins = [
      EnvironmentConfig.FRONTEND_URL,
      'http://localhost:3000',
      'http://localhost:5173',
      'https://localhost:3000',
      'https://localhost:5173'
    ].filter(Boolean); // Remove undefined values

    // Allow requests with no origin (mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      Logger.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count']
};

// Basic middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const PORT = EnvironmentConfig.PORT;

// Cookie session configuration with proper environment variables
app.use(cookieSession(EnvironmentConfig.getCookieConfig('github-auth-session')))
app.use(cookieSession(EnvironmentConfig.getCookieConfig('google-auth-session')))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Health check endpoint with proper typing
app.get("/", (req: express.Request, res: express.Response) => {
  res.status(200).json({
    message: "Server is up and running.",
    environment: EnvironmentConfig.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// API documentation
app.use('/api-docs', swaggerDocs, swaggerDocsSetup);

// Routes
app.use("/", router);

// Global error handler (must be last)
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  Logger.info(`Server is running on port ${PORT}`);
  Logger.info(`Environment: ${EnvironmentConfig.NODE_ENV}`);
  Logger.info(`API Documentation: ${EnvironmentConfig.BASE_URL}/api-docs`);
  
  // Initialize scheduled tasks for link management
  schedulerUtil.initializeScheduledTasks();
});

// Graceful shutdown handling
const gracefulShutdown = (signal: string) => {
  Logger.info(`Received ${signal}. Starting graceful shutdown...`);
  
  server.close(() => {
    Logger.info('HTTP server closed.');
    
    // Close database connections
    // Add any cleanup logic here
    
    process.exit(0);
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    Logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

// Listen for termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  Logger.error('Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  Logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  gracefulShutdown('unhandledRejection');
});