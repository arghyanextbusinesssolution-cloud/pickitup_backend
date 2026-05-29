import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import cloudinary, { CLOUDINARY_FOLDER } from '../../config/cloudinary';
import prisma from '../../config/db';

export class UploadController {
    /**
     * Upload multiple photos to Cloudinary under the pickitup_verification/{carrier_id} folder.
     * Expects multipart/form-data with field name "photos" (up to 10 files).
     * Returns an array of secure URLs.
     */
    async uploadPhotos(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            // Determine carrier ID for folder path as requested
            const carrier = await prisma.carrier.findUnique({
                where: { userId }
            });

            // Use specific folder name as requested for carrier documents
            const targetFolder = carrier
                ? `carrier id proof/${carrier.id}`
                : CLOUDINARY_FOLDER;

            if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
                return res.status(400).json({ error: 'No files uploaded' });
            }

            const uploadPromises = (req.files as Express.Multer.File[]).map((file) => {
                return new Promise<string>((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        {
                            folder: targetFolder,
                            resource_type: 'image',
                            transformation: [
                                { quality: 'auto', fetch_format: 'auto' },
                            ],
                        },
                        (error, result) => {
                            if (error) return reject(error);
                            resolve(result!.secure_url);
                        }
                    );
                    stream.end(file.buffer);
                });
            });

            const urls = await Promise.all(uploadPromises);

            console.log(`[Upload] ${urls.length} photo(s) uploaded to Cloudinary/${targetFolder} by user ${userId} (${req.user?.role})`);

            res.status(200).json({ urls });
        } catch (error: any) {
            console.error('[Upload] Cloudinary upload failed:', error);
            res.status(500).json({ error: 'Failed to upload photos' });
        }
    }
    /**
     * Upload a single blog cover image to Cloudinary under the 'blog' folder.
     * Expects multipart/form-data with field name "image".
     * Returns { url: string }
     */
    async uploadBlogImage(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const file = req.file;
            if (!file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            const url = await new Promise<string>((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'blog',
                        resource_type: 'image',
                        transformation: [
                            { quality: 'auto', fetch_format: 'auto' },
                            { width: 1200, crop: 'limit' }
                        ],
                    },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result!.secure_url);
                    }
                );
                stream.end(file.buffer);
            });

            console.log(`[Upload] Blog image uploaded to Cloudinary/blog by user ${userId}`);
            res.status(200).json({ url });
        } catch (error: any) {
            console.error('[Upload] Blog image upload failed:', error);
            res.status(500).json({ error: 'Failed to upload blog image' });
        }
    }
}

export const uploadController = new UploadController();

