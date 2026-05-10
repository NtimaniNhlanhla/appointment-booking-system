import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import pinoHttp from 'pino-http';
import { logger } from './config/logger.js';
import { env } from './config/env.js';
import { router } from './routes/index.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import { notFoundMiddleware } from './middleware/notFound.middleware.js';

export const app = express();

// Security
app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL, methods: ['GET', 'POST', 'PATCH'] }));

// Rate limiting (applied globally, tighter on booking endpoint in route)
app.use(rateLimit({ windowMs: 60_000, max: 100 }));

// Logging
app.use(pinoHttp({ logger }));

// Body parsing
app.use(express.json());

// Routes
 app.use('/api', router);

// Error handlers (must be last)
app.use(notFoundMiddleware);
app.use(errorMiddleware);