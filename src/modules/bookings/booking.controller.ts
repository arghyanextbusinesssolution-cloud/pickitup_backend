import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { BookingService } from './booking.service';

const bookingService = new BookingService();

export class BookingController {
    async create(req: AuthRequest, res: Response) {
        try {
            const { shipmentId, carrierId, price } = req.body;
            const result = await bookingService.create(shipmentId, carrierId, price);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async getMyBookings(req: AuthRequest, res: Response) {
        try {
            const result = await bookingService.getMyBookings(req.user!.userId, req.user!.role);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

export const bookingController = new BookingController();
