import { bidRepository } from './bid.repository';
import prisma from '../../config/db';

export class BidService {
    async placeBid(amount: number, deliveryDate: Date | undefined, shipmentId: string, carrierId: string) {
        const shipment = await prisma.shipment.findUnique({ where: { id: shipmentId } });
        if (!shipment || shipment.status !== 'PENDING') {
            throw new Error('Shipment not found or already booked');
        }

        return bidRepository.create({ amount, deliveryDate, shipmentId, carrierId });
    }

    async getShipmentBids(shipmentId: string) {
        return bidRepository.findManyByShipment(shipmentId);
    }

    async getCarrierBids(carrierId: string) {
        return bidRepository.findManyByCarrier(carrierId);
    }
}
