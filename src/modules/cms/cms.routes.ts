import { Router } from 'express';
import { cmsController } from './cms.controller';
import { authMiddleware, roleMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/:key', cmsController.get);
router.patch('/:key', authMiddleware, roleMiddleware(['ADMIN']), cmsController.update);

export default router;
