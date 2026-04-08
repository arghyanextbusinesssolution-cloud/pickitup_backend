import prisma from '../../config/db';

export class BidRepository {
    async create(data: { amount: number; deliveryEstimate?: Date; shipmentId: string; carrierId: string }) {
        return prisma.bid.create({
            data: {
                amount: data.amount,
                deliveryEstimate: data.deliveryEstimate,
                shipmentId: data.shipmentId,
                carrierId: data.carrierId,
            }
        });
    }

    async findById(id: string) {
        return prisma.bid.findUnique({
            where: { id },
            include: { carrier: true, shipment: true }
        });
    }

    async findManyByShipment(shipmentId: string) {
        return prisma.bid.findMany({
            where: { shipmentId },
            include: { carrier: true }
        });
    }

    async findManyByCarrier(carrierId: string) {
        return prisma.bid.findMany({
            where: { carrierId },
            include: { shipment: true }
        });
    }

    async updateStatus(id: string, status: 'PENDING' | 'ACCEPTED' | 'REJECTED') {
        return prisma.bid.update({
            where: { id },
            data: { status }
        });
    }
}

export const bidRepository = new BidRepository();
