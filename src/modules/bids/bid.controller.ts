import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { BidService } from './bid.service';
import prisma from '../../config/db';

const bidService = new BidService();

// Helper: get or auto-create Carrier profile for a CARRIER role user
async function getOrCreateCarrier(userId: string) {
    let carrier = await prisma.carrier.findUnique({ where: { userId } });
    if (!carrier) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || user.role !== 'CARRIER') return null;
        carrier = await prisma.carrier.create({
            data: {
                userId,
                companyName: `${user.firstName || 'Carrier'} Transport`,
            }
        });
    }
    return carrier;
}

export class BidController {
    async create(req: AuthRequest, res: Response) {
        try {
            const { shipmentId, amount, deliveryDate } = req.body;
            const carrier = await getOrCreateCarrier(req.user!.id);
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
            const carrier = await getOrCreateCarrier(req.user!.id);
            if (!carrier) return res.status(403).json({ error: 'Not a carrier' });

            const result = await bidService.getCarrierBids(carrier.id);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async acceptBid(req: AuthRequest, res: Response) {
        try {
            const bidId = req.params.bidId as string;
            const booking = await bidService.acceptBid(bidId, req.user!.id);
            res.status(201).json(booking);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async getById(req: AuthRequest, res: Response) {
        try {
            const bid = await bidService.getBidById(req.params.bidId as string);
            if (!bid) return res.status(404).json({ error: 'Bid not found' });
            res.status(200).json(bid);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

export const bidController = new BidController();
