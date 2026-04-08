import { Router } from 'express';
import { bookingController } from './booking.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', bookingController.create);
router.get('/my', bookingController.getMyBookings);
router.get('/:id', bookingController.getById);
router.post('/:id/verify-pickup', bookingController.verifyPickupOtp);
router.post('/:id/verify-delivery', bookingController.verifyDeliveryOtp);

export default router;
