import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { BidService } from './bid.service';
import prisma from '../../config/db';

const bidService = new BidService();

export class BidController {
    async create(req: AuthRequest, res: Response) {
        try {
            const { shipmentId, amount, deliveryDate } = req.body;
            const carrier = await prisma.carrier.findUnique({ where: { userId: req.user!.userId } });
            if (!carrier) return res.status(403).json({ error: 'Not a carrier' });

            const result = await bidService.placeBid(amount, deliveryDate, shipmentId, carrier.id);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async getShipmentBids(req: AuthRequest, res: Response) {
        try {
            const result = await bidService.getShipmentBids(req.params.shipmentId as string);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getMyBids(req: AuthRequest, res: Response) {
        try {
            const carrier = await prisma.carrier.findUnique({ where: { userId: req.user!.userId } });
            if (!carrier) return res.status(403).json({ error: 'Not a carrier' });

            const result = await bidService.getCarrierBids(carrier.id);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

export const bidController = new BidController();
