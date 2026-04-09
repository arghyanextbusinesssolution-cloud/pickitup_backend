"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentService = exports.PaymentService = void 0;
const stripe_1 = __importDefault(require("stripe"));
const env_1 = require("../../config/env");
const payment_repository_1 = require("./payment.repository");
const booking_repository_1 = require("../bookings/booking.repository");
const client_1 = require("@prisma/client");
const db_1 = __importDefault(require("../../config/db"));
const stripe = new stripe_1.default(env_1.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-03-25.dahlia',
});
class PaymentService {
    async createCheckoutSession(bookingId, userId) {
        const booking = await booking_repository_1.bookingRepository.findById(bookingId);
        if (!booking)
            throw new Error('Booking not found');
        // Ensure the requester is the shipment owner (shipper)
        if (booking.shipment.ownerId !== userId) {
            throw new Error('Not authorized to pay for this booking');
        }
        if (booking.paymentStatus === client_1.PaymentStatus.PAID) {
            throw new Error('Booking already paid');
        }
        try {
            const amount = Number(booking.price);
            const platformFee = Math.round(amount * 0.03 * 100) / 100; // 3% fee
            const totalAmount = amount + platformFee;
            // Log parameters to help debug
            console.log('DEBUG: Stripe Session Params:', {
                bookingId,
                userId,
                amount,
                totalAmount,
                cents: Math.round(totalAmount * 100)
            });
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: `Shipment Payment: ${booking.shipment.title}`,
                                description: `Booking ID: ${booking.id}`,
                            },
                            unit_amount: Math.round(totalAmount * 100), // Stripe expects cents
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: `${env_1.env.FRONTEND_URL}/shipper/dashboard/bookings/view?id=${booking.id}&payment=success`,
                cancel_url: `${env_1.env.FRONTEND_URL}/shipper/dashboard/bookings/view?id=${booking.id}&payment=cancel`,
                metadata: {
                    bookingId,
                    payerId: userId,
                },
            });
            // Initialize payment record
            await payment_repository_1.paymentRepository.create({
                bookingId,
                payerId: userId,
                amount: totalAmount,
                method: client_1.PaymentMethod.STRIPE,
                gatewayPaymentId: session.id,
            });
            return { url: session.url, sessionId: session.id };
        }
        catch (error) {
            console.error('ERROR: Checkout Session Creation Failed:', error);
            throw error;
        }
    }
    async handleWebhook(signature, payload) {
        let event;
        try {
            event = stripe.webhooks.constructEvent(payload, signature, env_1.env.STRIPE_WEBHOOK_SECRET);
        }
        catch (err) {
            console.error('⚠️ Webhook signature verification failed.', err.message);
            throw new Error(`Webhook Error: ${err.message}`);
        }
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const bookingId = session.metadata?.bookingId;
            if (bookingId) {
                await this.handleSuccessfulPayment(bookingId, session.id);
            }
        }
        return { received: true };
    }
    /**
     * Called by the frontend after returning from Stripe checkout.
     * Retrieves the Stripe session directly and updates payment status if paid.
     * This is the primary confirmation path for local dev (no webhook forwarding).
     */
    async confirmPayment(bookingId, userId) {
        const booking = await booking_repository_1.bookingRepository.findById(bookingId);
        if (!booking)
            throw new Error('Booking not found');
        if (booking.shipment.ownerId !== userId) {
            throw new Error('Not authorized');
        }
        // Already paid — no-op
        if (booking.paymentStatus === client_1.PaymentStatus.PAID) {
            return { status: 'already_paid' };
        }
        // Find the local payment record to get the Stripe session ID
        const paymentRecord = await db_1.default.payment.findFirst({
            where: { bookingId, method: client_1.PaymentMethod.STRIPE },
            orderBy: { createdAt: 'desc' },
        });
        if (!paymentRecord?.gatewayPaymentId) {
            throw new Error('No payment session found for this booking');
        }
        // Ask Stripe directly whether this session was paid
        const session = await stripe.checkout.sessions.retrieve(paymentRecord.gatewayPaymentId);
        console.log('DEBUG: Stripe session status:', session.payment_status, 'for booking:', bookingId);
        if (session.payment_status === 'paid') {
            await this.handleSuccessfulPayment(bookingId, paymentRecord.gatewayPaymentId);
            return { status: 'paid' };
        }
        return { status: session.payment_status }; // 'unpaid' | 'no_payment_required'
    }
    async handleSuccessfulPayment(bookingId, sessionId) {
        await db_1.default.$transaction(async (tx) => {
            // Update booking status
            await tx.booking.update({
                where: { id: bookingId },
                data: {
                    paymentStatus: client_1.PaymentStatus.PAID,
                }
            });
            // Update internal payment record
            const paymentRecord = await tx.payment.findFirst({
                where: { gatewayPaymentId: sessionId }
            });
            if (paymentRecord) {
                await tx.payment.update({
                    where: { id: paymentRecord.id },
                    data: { status: client_1.PaymentStatus.PAID }
                });
            }
        });
    }
}
exports.PaymentService = PaymentService;
exports.paymentService = new PaymentService();
