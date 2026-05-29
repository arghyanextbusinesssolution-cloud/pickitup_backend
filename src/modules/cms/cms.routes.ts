import { Router } from 'express';
import { cmsController } from './cms.controller';
import { authMiddleware, roleMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

// Legacy CMS routes
router.get('/content/:key', cmsController.getContent);
router.patch('/content/:key', authMiddleware, roleMiddleware(['ADMIN']), cmsController.updateContent);

// Blog routes
router.get('/blogs', cmsController.getAllBlogs);
router.get('/blogs/slug/:slug', cmsController.getBlogBySlug);
router.get('/blogs/:id', cmsController.getBlogById);

// Admin-only Blog routes
router.post('/blogs', authMiddleware, roleMiddleware(['ADMIN']), cmsController.createBlog);
router.put('/blogs/:id', authMiddleware, roleMiddleware(['ADMIN']), cmsController.updateBlog);
router.delete('/blogs/:id', authMiddleware, roleMiddleware(['ADMIN']), cmsController.deleteBlog);

export default router;
