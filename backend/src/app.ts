import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import routes from './routes/index.js';
import { notFoundMiddleware } from './middlewares/notFound.middleware.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { env } from './config/env.js';

// Load passport strategies config
import './config/passport.js';

const app = express();

// 1. Security Middlewares
app.use(helmet());
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
}));

// 2. Cookie Parser
app.use(cookieParser(env.COOKIE_SECRET));

// 3. Passport Middleware
app.use(passport.initialize());

// 4. Request Logging
if (env.NODE_ENV !== 'test') {
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// 5. Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 6. API Routes
app.use('/api/v1', routes);

// 7. 404 Handler (for unmatched routes)
app.use(notFoundMiddleware);

// 8. Global Error Handler
app.use(errorMiddleware);

export default app;
