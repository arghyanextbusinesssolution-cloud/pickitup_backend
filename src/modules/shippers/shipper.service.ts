import prisma from '../../config/db';

export class ShipperService {
    async getPaymentStats(ownerId: string) {
        const [totalSpent, inEscrow, totalShipments, completedCount, recentPayments] = await Promise.all([
            // Total Spent (Completed Bookings)
            prisma.booking.aggregate({
                _sum: { price: true },
                where: { shipment: { ownerId }, status: 'COMPLETED' }
            }),
            // In Escrow (Confirmed or In Transit)
            prisma.booking.aggregate({
                _sum: { price: true },
                where: { shipment: { ownerId }, status: { in: ['CONFIRMED', 'IN_TRANSIT'] } }
            }),
            // Total Shipments
            prisma.shipment.count({
                where: { ownerId }
            }),
            // Completed Shipments
            prisma.shipment.count({
                where: { ownerId, status: 'DELIVERED' }
            }),
            // Recent Payments/Bookings
            prisma.booking.findMany({
                where: { shipment: { ownerId } },
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: {
                    shipment: {
                        select: { title: true, id: true }
                    }
                }
            })
        ]);

        return {
            totalSpent: Number(totalSpent._sum.price || 0),
            inEscrow: Number(inEscrow._sum.price || 0),
            totalShipments,
            completedShipments: completedCount,
            recentPayments: recentPayments.map((p: any) => ({
                id: p.id,
                shipmentTitle: p.shipment.title,
                shipmentId: p.shipment.id,
                amount: Number(p.price),
                status: p.status,
                createdAt: p.createdAt
            }))
        };
    }
}

export const shipperService = new ShipperService();
