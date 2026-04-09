"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentController = exports.PaymentController = void 0;
const payment_service_1 = require("./payment.service");
class PaymentController {
    async createCheckoutSession(req, res) {
        try {
            const { bookingId } = req.body;
            if (!bookingId) {
                return res.status(400).json({ error: 'bookingId is required' });
            }
            const result = await payment_service_1.paymentService.createCheckoutSession(bookingId, req.user.id);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async confirmPayment(req, res) {
        try {
            const { bookingId } = req.body;
            if (!bookingId) {
                return res.status(400).json({ error: 'bookingId is required' });
            }
            const result = await payment_service_1.paymentService.confirmPayment(bookingId, req.user.id);
            res.status(200).json(result);
        }
        catch (error) {
            console.error('Confirm payment error:', error.message);
            res.status(400).json({ error: error.message });
        }
    }
    async webhook(req, res) {
        const sig = req.headers['stripe-signature'];
        if (!sig) {
            return res.status(400).send('Webhook Error: Missing signature');
        }
        try {
            // Stripe requires the RAW body (Buffer) for signature verification.
            // We expect the 'req.body' here to be the raw buffer, configured in the routes/app.
            const result = await payment_service_1.paymentService.handleWebhook(sig, req.body);
            res.status(200).json(result);
        }
        catch (err) {
            console.error('Webhook processing failed:', err.message);
            res.status(400).send(`Webhook Error: ${err.message}`);
        }
    }
}
exports.PaymentController = PaymentController;
exports.paymentController = new PaymentController();
