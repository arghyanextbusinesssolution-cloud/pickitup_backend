import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { CarrierService } from './carrier.service';

const carrierService = new CarrierService();

export class CarrierController {
    async getProfile(req: AuthRequest, res: Response) {
        try {
            const result = await carrierService.findProfile(req.user!.id);
            if (!result) return res.status(404).json({ error: 'Carrier profile not found' });
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async placeBid(req: AuthRequest, res: Response) {
        try {
            const { shipmentId, amount, deliveryDate } = req.body;
            const carrier = await carrierService.findProfile(req.user!.id);
            if (!carrier) return res.status(403).json({ error: 'Not a carrier' });

            const result = await carrierService.placeBid(carrier.id, shipmentId, amount, deliveryDate);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async getMyBids(req: AuthRequest, res: Response) {
        try {
            const carrier = await carrierService.findProfile(req.user!.id);
            if (!carrier) return res.status(403).json({ error: 'Not a carrier' });

            const result = await carrierService.getCarrierBids(carrier.id);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getEarningsStats(req: AuthRequest, res: Response) {
        try {
            const carrier = await carrierService.findProfile(req.user!.id);
            if (!carrier) return res.status(403).json({ error: 'Not a carrier' });

            const result = await carrierService.getEarningsStats(carrier.id);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

export const carrierController = new CarrierController();
