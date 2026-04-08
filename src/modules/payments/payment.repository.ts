import { Prisma, PaymentStatus, PaymentMethod } from '@prisma/client';
import prisma from '../../config/db';

export class PaymentRepository {
    async create(data: {
        bookingId: string;
        payerId: string;
        amount: number;
        currency?: string;
        method: PaymentMethod;
        gatewayPaymentId?: string;
    }) {
        return prisma.payment.create({
            data: {
                bookingId: data.bookingId,
                payerId: data.payerId,
                amount: new Prisma.Decimal(data.amount),
                currency: data.currency || 'USD',
                method: data.method,
                gatewayPaymentId: data.gatewayPaymentId,
                status: PaymentStatus.PENDING,
            }
        });
    }

    async updateStatus(id: string, status: PaymentStatus, gatewayPaymentId?: string) {
        return prisma.payment.update({
            where: { id },
            data: { 
                status,
                gatewayPaymentId: gatewayPaymentId || undefined
            }
        });
    }

    async findByGatewayId(gatewayPaymentId: string) {
        return prisma.payment.findFirst({
            where: { gatewayPaymentId }
        });
    }
}

export const paymentRepository = new PaymentRepository();
