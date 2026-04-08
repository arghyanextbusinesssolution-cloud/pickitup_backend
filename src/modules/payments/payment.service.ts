import Stripe from 'stripe';
import { env } from '../../config/env';
import { paymentRepository } from './payment.repository';
import { bookingRepository } from '../bookings/booking.repository';
import { PaymentStatus, BookingStatus, PaymentMethod } from '@prisma/client';
import prisma from '../../config/db';

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-03-25.dahlia',
});


export class PaymentService {
    async createCheckoutSession(bookingId: string, userId: string) {
        const booking = await bookingRepository.findById(bookingId);
        if (!booking) throw new Error('Booking not found');
        
        // Ensure the requester is the shipment owner (shipper)
        if (booking.shipment.ownerId !== userId) {
            throw new Error('Not authorized to pay for this booking');
        }

        if (booking.paymentStatus === PaymentStatus.PAID) {
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
                success_url: `${env.FRONTEND_URL}/shipper/dashboard/bookings/view?id=${booking.id}&payment=success`,
                cancel_url: `${env.FRONTEND_URL}/shipper/dashboard/bookings/view?id=${booking.id}&payment=cancel`,
                metadata: {
                    bookingId,
                    payerId: userId,
                },
            });

            // Initialize payment record
            await paymentRepository.create({
                bookingId,
                payerId: userId,
                amount: totalAmount,
                method: PaymentMethod.STRIPE,
                gatewayPaymentId: session.id,
            });

            return { url: session.url, sessionId: session.id };
        } catch (error: any) {
            console.error('ERROR: Checkout Session Creation Failed:', error);
            throw error;
        }
    }

    async handleWebhook(signature: string, payload: Buffer) {
        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(
                payload,
                signature,
                env.STRIPE_WEBHOOK_SECRET
            );
        } catch (err: any) {
            console.error('⚠️ Webhook signature verification failed.', err.message);
            throw new Error(`Webhook Error: ${err.message}`);
        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;
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
    async confirmPayment(bookingId: string, userId: string) {
        const booking = await bookingRepository.findById(bookingId);
        if (!booking) throw new Error('Booking not found');

        if (booking.shipment.ownerId !== userId) {
            throw new Error('Not authorized');
        }

        // Already paid — no-op
        if (booking.paymentStatus === PaymentStatus.PAID) {
            return { status: 'already_paid' };
        }

        // Find the local payment record to get the Stripe session ID
        const paymentRecord = await prisma.payment.findFirst({
            where: { bookingId, method: PaymentMethod.STRIPE },
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

    private async handleSuccessfulPayment(bookingId: string, sessionId: string) {
        await prisma.$transaction(async (tx) => {
            // Update booking status
            await tx.booking.update({
                where: { id: bookingId },
                data: { 
                    paymentStatus: PaymentStatus.PAID,
                }
            });

            // Update internal payment record
            const paymentRecord = await tx.payment.findFirst({
                where: { gatewayPaymentId: sessionId }
            });

            if (paymentRecord) {
                await tx.payment.update({
                    where: { id: paymentRecord.id },
                    data: { status: PaymentStatus.PAID }
                });
            }
        });
    }
}

export const paymentService = new PaymentService();
