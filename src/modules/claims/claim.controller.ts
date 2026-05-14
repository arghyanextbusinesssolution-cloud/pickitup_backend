import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { claimService } from './claim.service';

export class ClaimController {
    async create(req: AuthRequest, res: Response) {
        try {
            const { bookingId, reason, photos } = req.body;
            const result = await claimService.openClaim(bookingId as string, reason as string, req.user!.id, photos as string[]);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async getAll(req: AuthRequest, res: Response) {
        try {
            const result = await claimService.getAllClaims();
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req: AuthRequest, res: Response) {
        try {
            const result = await claimService.getClaimById(req.params.id as string);
            if (!result) return res.status(404).json({ error: 'Claim not found' });
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getEligible(req: AuthRequest, res: Response) {
        try {
            const result = await claimService.getEligibleBookings(req.user!.id);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

export const claimController = new ClaimController();
