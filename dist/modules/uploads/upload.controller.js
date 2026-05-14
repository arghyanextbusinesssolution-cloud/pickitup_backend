"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadController = exports.UploadController = void 0;
const cloudinary_1 = __importStar(require("../../config/cloudinary"));
class UploadController {
    /**
     * Upload multiple photos to Cloudinary under the dpickitup folder.
     * Expects multipart/form-data with field name "photos" (up to 10 files).
     * Returns an array of secure URLs.
     */
    async uploadPhotos(req, res) {
        try {
            if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
                return res.status(400).json({ error: 'No files uploaded' });
            }
            const uploadPromises = req.files.map((file) => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary_1.default.uploader.upload_stream({
                        folder: cloudinary_1.CLOUDINARY_FOLDER,
                        resource_type: 'image',
                        transformation: [
                            { quality: 'auto', fetch_format: 'auto' },
                        ],
                    }, (error, result) => {
                        if (error)
                            return reject(error);
                        resolve(result.secure_url);
                    });
                    stream.end(file.buffer);
                });
            });
            const urls = await Promise.all(uploadPromises);
            console.log(`[Upload] ${urls.length} photo(s) uploaded to Cloudinary/${cloudinary_1.CLOUDINARY_FOLDER} by user ${req.user?.id}`);
            res.status(200).json({ urls });
        }
        catch (error) {
            console.error('[Upload] Cloudinary upload failed:', error);
            res.status(500).json({ error: 'Failed to upload photos' });
        }
    }
}
exports.UploadController = UploadController;
exports.uploadController = new UploadController();
