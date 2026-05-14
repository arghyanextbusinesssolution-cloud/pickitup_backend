import { Router } from 'express';
import { claimController } from './claim.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', claimController.create);
router.get('/', claimController.getAll);
router.get('/eligible', claimController.getEligible);
router.get('/:id', claimController.getById);

export default router;
