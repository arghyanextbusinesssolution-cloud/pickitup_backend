import { Router } from 'express';
import { shipperController } from './shipper.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/stats', authMiddleware, shipperController.getPaymentStats);

export default router;
