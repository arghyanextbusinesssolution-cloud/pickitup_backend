import { carrierRepository } from './carrier.repository';
import prisma from '../../config/db'; // Still used for non-carrier specific bid creation if needed, or move to bid repo

export class CarrierService {
    async findProfile(userId: string) {
        return carrierRepository.findByUserId(userId);
    }

    async placeBid(carrierId: string, shipmentId: string, amount: number, deliveryDate?: Date) {
        const shipment = await prisma.shipment.findUnique({ where: { id: shipmentId } });
        if (!shipment || shipment.status !== 'PENDING') {
            throw new Error('Shipment not found or already booked');
        }

        return prisma.bid.create({
            data: {
                amount,
                deliveryDate,
                shipmentId,
                carrierId
            }
        });
    }

    async getCarrierBids(carrierId: string) {
        return prisma.bid.findMany({
            where: { carrierId },
            include: {
                shipment: true
            }
        });
    }
}
