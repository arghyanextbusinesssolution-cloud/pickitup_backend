import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { shipperService } from './shipper.service';

export class ShipperController {
    async getPaymentStats(req: AuthRequest, res: Response) {
        try {
            const stats = await shipperService.getPaymentStats(req.user!.id);
            res.status(200).json(stats);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async updatePhone(req: AuthRequest, res: Response) {
        try {
            const { phone } = req.body;
            if (!phone) return res.status(400).json({ error: 'phone is required' });
            const result = await shipperService.updatePhone(req.user!.id, phone);
            res.status(200).json({ message: 'Phone updated', user: result });
        } catch (error: any) {
            if (error.code === 'P2002' && error.meta?.target) {
                return res.status(400).json({ error: 'This phone number is already registered.' });
            }
            res.status(500).json({ error: error.message });
        }
    }

    async addAddress(req: AuthRequest, res: Response) {
        try {
            const { addressLine1, city, state, country, postalCode } = req.body;
            if (!addressLine1 || !city || !country) {
                return res.status(400).json({ error: 'addressLine1, city, and country are required' });
            }
            const result = await shipperService.addAddress(req.user!.id, {
                addressLine1,
                city,
                state: state || '',
                country,
                postalCode: postalCode || ''
            });
            res.status(201).json({ message: 'Address saved. Profile complete.', address: result });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

export const shipperController = new ShipperController();
