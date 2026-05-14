import { Router } from 'express';
import { shipperController } from './shipper.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/stats', authMiddleware, shipperController.getPaymentStats.bind(shipperController));

// Onboarding Steps (require JWT — issued after email OTP verification)
router.patch('/me/phone', authMiddleware, shipperController.updatePhone.bind(shipperController));
router.post('/me/address', authMiddleware, shipperController.addAddress.bind(shipperController));

export default router;
