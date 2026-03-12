import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { AdminService } from './admin.service';

const adminService = new AdminService();

export class AdminController {
    async getStats(req: AuthRequest, res: Response) {
        try {
            const stats = await adminService.getPlatformStats();
            res.status(200).json(stats);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

export const adminController = new AdminController();
