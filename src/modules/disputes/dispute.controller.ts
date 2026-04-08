import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { DisputeService } from './dispute.service';

const disputeService = new DisputeService();

export class DisputeController {
    async create(req: AuthRequest, res: Response) {
        try {
            const { bookingId, reason } = req.body;
            const result = await disputeService.openDispute(bookingId, reason, req.user!.id);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async getAll(req: AuthRequest, res: Response) {
        try {
            const result = await disputeService.getAllDisputes();
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

export const disputeController = new DisputeController();
