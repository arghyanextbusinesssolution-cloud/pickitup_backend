import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { BookingService } from './booking.service';

const bookingService = new BookingService();

export class BookingController {
    async create(req: AuthRequest, res: Response) {
        try {
            const { shipmentId, carrierId, price, bidId } = req.body;
            if (!bidId) throw new Error("bidId is required");
            const result = await bookingService.create(shipmentId, carrierId, price, bidId);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async getById(req: AuthRequest, res: Response) {
        try {
            const result = await bookingService.getById(req.params.id as string);
            if (!result) return res.status(404).json({ error: 'Booking not found' });
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getMyBookings(req: AuthRequest, res: Response) {
        try {
            const result = await bookingService.getMyBookings(req.user!.id, req.user!.role);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async verifyPickupOtp(req: AuthRequest, res: Response) {
        try {
            const { otp } = req.body;
            const result = await bookingService.verifyPickupOtp(req.params.id as string, otp as string);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async verifyDeliveryOtp(req: AuthRequest, res: Response) {
        try {
            const { otp } = req.body;
            const result = await bookingService.verifyDeliveryOtp(req.params.id as string, otp as string);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}

export const bookingController = new BookingController();
