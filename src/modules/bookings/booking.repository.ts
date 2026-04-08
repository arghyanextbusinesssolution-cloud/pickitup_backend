import { Prisma, BookingStatus, ShipmentStatus, BidStatus } from '@prisma/client';
import prisma from '../../config/db';

export class BookingRepository {
    async create(shipmentId: string, carrierId: string, price: number, bidId: string) {
        return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const deliveryOtp = Math.floor(100000 + Math.random() * 900000).toString();
            const booking = await tx.booking.create({
                data: {
                    shipmentId,
                    carrierId,
                    bidId,
                    price: new Prisma.Decimal(price),
                    status: BookingStatus.CONFIRMED,
                    otp,
                    deliveryOtp
                }
            });

            await tx.shipment.update({
                where: { id: shipmentId },
                data: { status: ShipmentStatus.ASSIGNED }
            });

            await tx.bid.updateMany({
                where: { shipmentId, carrierId },
                data: { status: BidStatus.ACCEPTED }
            });

            await tx.bid.updateMany({
                where: { shipmentId, NOT: { carrierId } },
                data: { status: BidStatus.REJECTED }
            });

            return booking;
        });
    }

    async findById(id: string) {
        return prisma.booking.findUnique({
            where: { id },
            include: {
                shipment: true,
                carrier: { include: { user: true } },
                bid: true,
            }
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
