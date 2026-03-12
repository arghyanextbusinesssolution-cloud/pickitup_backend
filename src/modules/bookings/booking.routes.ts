import { Router } from 'express';
import { bookingController } from './booking.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', bookingController.create);
router.get('/my', bookingController.getMyBookings);

export default router;
