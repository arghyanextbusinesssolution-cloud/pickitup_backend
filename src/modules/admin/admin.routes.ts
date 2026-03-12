import { Router } from 'express';
import { adminController } from './admin.controller';
import { authMiddleware, roleMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(['ADMIN']));

router.get('/stats', adminController.getStats);

export default router;
