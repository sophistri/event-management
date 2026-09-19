import { Router } from 'express';
import { signup, login, logout, me } from '../controllers/auth.controller.js';
// import { verifyEmail, resendVerification } from '../controllers/auth.controller.js'; // email verification
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/authenticate.js';
import { signupSchema, loginSchema } from '../validators/auth.schema.js';

const router = Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', authenticate, me);

// --- Email verification (uncomment to enable) ---
// router.post('/verify-email', verifyEmail);
// router.post('/resend-verification', resendVerification);

export default router;
