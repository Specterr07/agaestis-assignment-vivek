import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config/env.js';
import prisma from './config/db.js';
import employeeRoutes from './routes/employee.routes.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';

const app = express();

// Middlewares
app.use(
  cors({
    origin: '*', // Allows local dev with any port (5173, etc.)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(morgan('dev'));

// Cache control headers: Weak ETag enabled by default in Express; prevent stale client cache
app.set('etag', 'weak');
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, must-revalidate');
  next();
});

// Health check endpoint
app.get('/api/v1/health', async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      success: true,
      status: 'UP',
      database: 'CONNECTED',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(503).json({
      success: false,
      status: 'DOWN',
      database: 'DISCONNECTED',
      error: error.message,
    });
  }
});

// API Routes
app.use('/api/v1/employees', employeeRoutes);

// Fallback for unmatched routes
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Cannot ${req.method} ${req.originalUrl}`,
    },
  });
});

// Centralized error handler
app.use(errorHandler);

// Start server
const server = app.listen(config.port, () => {
  console.log(`🚀 Server running on http://localhost:${config.port}`);
  console.log(`📡 Health check: http://localhost:${config.port}/api/v1/health`);
  console.log(`👥 Employees API: http://localhost:${config.port}/api/v1/employees`);
});

export default app;
