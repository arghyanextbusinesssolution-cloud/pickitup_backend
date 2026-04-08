import express, { Router } from 'express';
import { paymentController } from './payment.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

// NOTE: The webhook route must NOT use the authMiddleware because Stripe calls it.
// Also, it requires the RAW body. 
// We will handle the RAW body middleware in app.ts to ensure it's applied correctly.
router.post('/webhook', paymentController.webhook);

// These routes require authentication
router.post('/create-checkout-session', authMiddleware, paymentController.createCheckoutSession);
router.post('/confirm-payment', authMiddleware, paymentController.confirmPayment);

export default router;
