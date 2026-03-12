import { bookingRepository } from './booking.repository';
import prisma from '../../config/db';

export class BookingService {
    async create(shipmentId: string, carrierId: string, price: number) {
        return bookingRepository.create(shipmentId, carrierId, price);
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
}
