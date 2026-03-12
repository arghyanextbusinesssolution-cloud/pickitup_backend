import { Router } from 'express';
import { invoiceController } from './invoice.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/generate', invoiceController.generate);

export default router;
