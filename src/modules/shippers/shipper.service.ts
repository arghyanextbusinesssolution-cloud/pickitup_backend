import prisma from '../../config/db';

export class ShipperService {
    async getPaymentStats(ownerId: string) {
        const [totalSpent, inEscrow, totalShipments, completedCount, recentPayments] = await Promise.all([
            prisma.booking.aggregate({
                _sum: { price: true },
                where: { shipment: { ownerId }, status: 'COMPLETED' }
            }),
            prisma.booking.aggregate({
                _sum: { price: true },
                where: { shipment: { ownerId }, status: { in: ['CONFIRMED', 'IN_TRANSIT'] } }
            }),
            prisma.shipment.count({ where: { ownerId } }),
            prisma.shipment.count({ where: { ownerId, status: 'DELIVERED' } }),
            prisma.booking.findMany({
                where: { shipment: { ownerId } },
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: { shipment: { select: { title: true, id: true } } }
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

    async updatePhone(userId: string, phone: string) {
        return prisma.user.update({
            where: { id: userId },
            data: { phone },
            select: { id: true, email: true, phone: true }
        });
    }

    async addAddress(userId: string, data: {
        addressLine1: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
    }) {
        // Mark user as verified once address is submitted (all steps complete)
        await prisma.user.update({
            where: { id: userId },
            data: { isVerified: true }
        });

        return prisma.userAddress.create({
            data: {
                userId,
                addressLine1: data.addressLine1,
                addressLine2: undefined,
                city: data.city,
                state: data.state,
                country: data.country,
                postalCode: data.postalCode,
            }
        });
    }
}

export const shipperService = new ShipperService();
