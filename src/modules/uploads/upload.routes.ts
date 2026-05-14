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

// POST /api/uploads/photos — Upload up to 10 images
router.post('/photos', upload.array('photos', 10), uploadController.uploadPhotos);

export default router;
