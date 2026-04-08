import { ShipmentStatus } from '@prisma/client';
import { carrierRepository } from './carrier.repository';
import prisma from '../../config/db'; // Still used for non-carrier specific bid creation if needed, or move to bid repo

export class CarrierService {
    async findProfile(userId: string) {
        return carrierRepository.findByUserId(userId);
    }

    async placeBid(carrierId: string, shipmentId: string, amount: number, deliveryDate?: Date) {
        const shipment = await prisma.shipment.findUnique({ where: { id: shipmentId } });
        if (!shipment || shipment.status !== ShipmentStatus.OPEN) {
            throw new Error('Shipment not found or already booked');
        }

        return prisma.bid.create({
            data: {
                amount,
                deliveryEstimate: deliveryDate,
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

    async getEarningsStats(carrierId: string) {
        const [delivered, inTransit, totalEarned, potentialEarned, recentTransactions] = await Promise.all([
            // Delivered Count
            prisma.booking.count({ 
                where: { carrierId, status: 'COMPLETED' } 
            }),
            // In Transit / Confirmed Count
            prisma.booking.count({ 
                where: { carrierId, status: { in: ['CONFIRMED', 'IN_TRANSIT'] } } 
            }),
            // Total Earned
            prisma.booking.aggregate({
                _sum: { price: true },
                where: { carrierId, status: 'COMPLETED' }
            }),
            // Potential Earned
            prisma.booking.aggregate({
                _sum: { price: true },
                where: { carrierId, status: { in: ['CONFIRMED', 'IN_TRANSIT'] } }
            }),
            // Recent Transactions
            prisma.booking.findMany({
                where: { carrierId },
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    shipment: {
                        select: { title: true }
                    }
                }
            })
        ]);

        return {
            deliveredCount: delivered,
            inTransitCount: inTransit,
            totalEarned: Number(totalEarned._sum.price || 0),
            potentialEarnings: Number(potentialEarned._sum.price || 0),
            recentTransactions: recentTransactions.map((bt: any) => ({
                id: bt.id,
                title: bt.shipment.title,
                amount: Number(bt.price),
                status: bt.status,
                createdAt: bt.createdAt
            }))
        };
    }
}
