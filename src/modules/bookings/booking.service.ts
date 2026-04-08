import { bookingRepository } from './booking.repository';
import prisma from '../../config/db';
import { ShipmentStatus, BookingStatus } from '@prisma/client';

export class BookingService {
    async create(shipmentId: string, carrierId: string, price: number, bidId: string) {
        return bookingRepository.create(shipmentId, carrierId, price, bidId);
    }

    async getById(id: string) {
        return bookingRepository.findById(id);
    }

    async getMyBookings(userId: string, role: string) {
        if (role === 'CARRIER') {
            const carrier = await prisma.carrier.findUnique({ where: { userId } });
            if (!carrier) throw new Error('Carrier profile not found');
            return bookingRepository.findManyByCarrier(carrier.id);
        } else {
            return bookingRepository.findManyByOwner(userId);
        }
    }

    async verifyPickupOtp(bookingId: string, otp: string) {
        const booking = await bookingRepository.findById(bookingId);
        if (!booking) throw new Error('Booking not found');

        if (booking.otp !== otp) {
            throw new Error('Invalid pickup OTP code. Please check with the shipper.');
        }

        // Atomically update shipment status
        await prisma.$transaction([
            prisma.shipment.update({
                where: { id: booking.shipmentId },
                data: { status: ShipmentStatus.IN_TRANSIT },
            })
        ]);

        return { success: true, status: 'PICKED_UP' };
    }

    async verifyDeliveryOtp(bookingId: string, otp: string) {
        const booking = await bookingRepository.findById(bookingId);
        if (!booking) throw new Error('Booking not found');

        if (booking.deliveryOtp !== otp) {
            throw new Error('Invalid delivery OTP code. Please check with the receiver.');
        }

        await prisma.$transaction([
            prisma.shipment.update({
                where: { id: booking.shipmentId },
                data: { status: ShipmentStatus.DELIVERED },
            }),
            prisma.booking.update({
                where: { id: bookingId },
                data: { status: BookingStatus.COMPLETED },
            }),
        ]);

        return { success: true, status: 'DELIVERED' };
    }

    async updateStatus(bookingId: string, shipmentId: string, status: ShipmentStatus) {
        const bookingStatusMap: Partial<Record<ShipmentStatus, BookingStatus>> = {
            [ShipmentStatus.IN_TRANSIT]: BookingStatus.IN_TRANSIT,
            [ShipmentStatus.DELIVERED]: BookingStatus.COMPLETED,
        };
        const bookingStatus = bookingStatusMap[status];

        await prisma.$transaction([
            prisma.shipment.update({
                where: { id: shipmentId },
                data: { status },
            }),
            ...(bookingStatus
                ? [prisma.booking.update({ where: { id: bookingId }, data: { status: bookingStatus } })]
                : []),
        ]);

        return { success: true, status };
    }
}

export const bookingService = new BookingService();
