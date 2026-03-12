import { paymentRepository } from './payment.repository';

export class PaymentService {
    async processPayment(bookingId: string, amount: number) {
        // Business logic for payment (stripe integration etc)
        return paymentRepository.createPayment({ bookingId, amount, status: 'SUCCESS' });
    }
}
