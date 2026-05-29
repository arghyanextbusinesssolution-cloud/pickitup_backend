import { Router } from 'express';
import multer from 'multer';
import { uploadController } from './upload.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

// Use memory storage — files stay in buffer, streamed directly to Cloudinary
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB per file
        files: 10,                    // Max 10 files at once
    },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    },
});

router.use(authMiddleware);

// POST /api/uploads/photos — Upload up to 10 images (carrier docs)
router.post('/photos', upload.array('photos', 10), uploadController.uploadPhotos);

// POST /api/uploads/blog-image — Upload a single blog cover image to Cloudinary/blog
router.post('/blog-image', upload.single('image'), uploadController.uploadBlogImage);

export default router;
