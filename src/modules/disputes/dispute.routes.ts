import { Router } from 'express';
import { disputeController } from './dispute.controller';
import { authMiddleware, roleMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', disputeController.create);
router.get('/', roleMiddleware(['ADMIN']), disputeController.getAll);

export default router;
