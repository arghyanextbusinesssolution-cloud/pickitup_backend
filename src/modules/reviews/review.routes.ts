import { Router } from 'express';
import { reviewController } from './review.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', reviewController.create);
router.get('/:userId', reviewController.getUserReviews);

export default router;
