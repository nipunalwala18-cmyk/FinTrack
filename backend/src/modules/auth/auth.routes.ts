import { Router } from 'express';
import passport from 'passport';
import { AuthController } from './auth.controller.js';
import { registerSchema, loginSchema } from './auth.schema.js';
import { validateMiddleware } from '../../middlewares/validate.middleware.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { authRateLimiter } from '../../middlewares/rateLimiter.js';

const router = Router();
const controller = new AuthController();

// Apply auth rate limiting to all authentication routes
router.use(authRateLimiter);

router.post('/register', validateMiddleware(registerSchema), controller.register);
router.post('/login', validateMiddleware(loginSchema), controller.login);
router.post('/refresh', controller.refresh);
router.post('/logout', authMiddleware, controller.logout);
router.get('/me', authMiddleware, controller.getMe);

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login?error=oauth_failed',
    session: false,
  }),
  controller.googleOAuthCallback
);

export default router;
