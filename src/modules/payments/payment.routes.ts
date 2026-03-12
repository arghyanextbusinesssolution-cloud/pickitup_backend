import { Router } from 'express';
import { paymentController } from './payment.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/pay', paymentController.pay);

export default router;
