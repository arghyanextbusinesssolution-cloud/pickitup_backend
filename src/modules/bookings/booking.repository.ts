import { Prisma } from '@prisma/client';
import prisma from '../../config/db';

export class BookingRepository {
    async create(shipmentId: string, carrierId: string, price: number) {
        return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const booking = await tx.booking.create({
                data: {
                    shipmentId,
                    carrierId,
                    price,
                    status: 'CONFIRMED'
                }
            });

            await tx.shipment.update({
                where: { id: shipmentId },
                data: { status: 'BOOKED' }
            });

            await tx.bid.updateMany({
                where: { shipmentId, carrierId },
                data: { status: 'ACCEPTED' }
            });

            await tx.bid.updateMany({
                where: { shipmentId, NOT: { carrierId } },
                data: { status: 'REJECTED' }
            });

            return booking;
        });
    }

    async findManyByCarrier(carrierId: string) {
        return prisma.booking.findMany({
            where: { carrierId },
            include: { shipment: true }
        });
    }

    async findManyByOwner(userId: string) {
        return prisma.booking.findMany({
            where: { shipment: { ownerId: userId } },
            include: { carrier: true, shipment: true }
        });
    }
}

export const bookingRepository = new BookingRepository();
