import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { shipperService } from './shipper.service';

export class ShipperController {
    async getPaymentStats(req: AuthRequest, res: Response) {
        try {
            // Verify ownership if needed, but here we use the authenticated user ID
            const stats = await shipperService.getPaymentStats(req.user!.id);
            res.status(200).json(stats);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

export const shipperController = new ShipperController();
