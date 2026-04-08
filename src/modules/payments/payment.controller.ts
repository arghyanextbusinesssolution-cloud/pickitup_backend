import { Request, Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { paymentService } from './payment.service';

export class PaymentController {
    async createCheckoutSession(req: AuthRequest, res: Response) {
        try {
            const { bookingId } = req.body;
            if (!bookingId) {
                return res.status(400).json({ error: 'bookingId is required' });
            }

            const result = await paymentService.createCheckoutSession(bookingId, req.user!.id);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async confirmPayment(req: AuthRequest, res: Response) {
        try {
            const { bookingId } = req.body;
            if (!bookingId) {
                return res.status(400).json({ error: 'bookingId is required' });
            }

            const result = await paymentService.confirmPayment(bookingId, req.user!.id);
            res.status(200).json(result);
        } catch (error: any) {
            console.error('Confirm payment error:', error.message);
            res.status(400).json({ error: error.message });
        }
    }

    async webhook(req: Request, res: Response) {
        const sig = req.headers['stripe-signature'];

        if (!sig) {
            return res.status(400).send('Webhook Error: Missing signature');
        }

        try {
            // Stripe requires the RAW body (Buffer) for signature verification.
            // We expect the 'req.body' here to be the raw buffer, configured in the routes/app.
            const result = await paymentService.handleWebhook(sig as string, req.body);
            res.status(200).json(result);
        } catch (err: any) {
            console.error('Webhook processing failed:', err.message);
            res.status(400).send(`Webhook Error: ${err.message}`);
        }
    }
}

export const paymentController = new PaymentController();
