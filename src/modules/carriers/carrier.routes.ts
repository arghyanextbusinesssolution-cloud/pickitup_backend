import { Router } from 'express';
import { carrierController } from './carrier.controller';
import { authMiddleware, roleMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(['CARRIER', 'ADMIN']));

router.get('/profile', carrierController.getProfile);
router.post('/bid', carrierController.placeBid);
router.get('/bids', carrierController.getMyBids);

export default router;
