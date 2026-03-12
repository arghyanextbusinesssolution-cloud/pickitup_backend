import prisma from '../../config/db';

export class AdminRepository {
    async getAnalytics() {
        const userCount = await prisma.user.count();
        const shipmentCount = await prisma.shipment.count();
        const bookingCount = await prisma.booking.count();

        return { userCount, shipmentCount, bookingCount };
    }
}

export const adminRepository = new AdminRepository();
