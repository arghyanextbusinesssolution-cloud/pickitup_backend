import { Router } from 'express';
import { authController } from './auth.controller';

const router = Router();

router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));

// OTP - Email Verification (Step 2 of shipper onboarding)
router.post('/otp/send', authController.sendEmailOtp.bind(authController));
router.post('/otp/verify', authController.verifyEmailOtp.bind(authController));

export default router;
