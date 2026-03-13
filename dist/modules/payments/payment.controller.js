"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentController = exports.PaymentController = void 0;
const payment_service_1 = require("./payment.service");
const paymentService = new payment_service_1.PaymentService();
class PaymentController {
    async pay(req, res) {
        try {
            const { bookingId, amount } = req.body;
            const result = await paymentService.processPayment(bookingId, amount);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.PaymentController = PaymentController;
exports.paymentController = new PaymentController();
