import { Router } from 'express';
import { enquiryController } from './enquiry.controller';
import { authMiddleware, roleMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

// Public route — anyone can submit the contact form
router.post('/submit', enquiryController.submit.bind(enquiryController));

// Admin-only routes
router.get('/', authMiddleware, roleMiddleware(['ADMIN']), enquiryController.getAll.bind(enquiryController));
router.get('/count/new', authMiddleware, roleMiddleware(['ADMIN']), enquiryController.countNew.bind(enquiryController));
router.get('/:id', authMiddleware, roleMiddleware(['ADMIN']), enquiryController.getOne.bind(enquiryController));
router.patch('/:id/status', authMiddleware, roleMiddleware(['ADMIN']), enquiryController.updateStatus.bind(enquiryController));

export default router;
