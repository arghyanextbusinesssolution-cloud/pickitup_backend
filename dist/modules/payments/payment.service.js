"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const payment_repository_1 = require("./payment.repository");
class PaymentService {
    async processPayment(bookingId, amount) {
        // Business logic for payment (stripe integration etc)
        return payment_repository_1.paymentRepository.createPayment({ bookingId, amount, status: 'SUCCESS' });
    }
}
exports.PaymentService = PaymentService;
