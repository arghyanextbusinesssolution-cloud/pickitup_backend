import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { PaymentService } from './payment.service';

const paymentService = new PaymentService();

export class PaymentController {
    async pay(req: AuthRequest, res: Response) {
        try {
            const { bookingId, amount } = req.body;
            const result = await paymentService.processPayment(bookingId, amount);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}

export const paymentController = new PaymentController();
