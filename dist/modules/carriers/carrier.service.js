"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarrierService = void 0;
const client_1 = require("@prisma/client");
const carrier_repository_1 = require("./carrier.repository");
const db_1 = __importDefault(require("../../config/db")); // Still used for non-carrier specific bid creation if needed, or move to bid repo
class CarrierService {
    async findProfile(userId) {
        return carrier_repository_1.carrierRepository.findByUserId(userId);
    }
    async placeBid(carrierId, shipmentId, amount, deliveryDate) {
        const shipment = await db_1.default.shipment.findUnique({ where: { id: shipmentId } });
        if (!shipment || shipment.status !== client_1.ShipmentStatus.OPEN) {
            throw new Error('Shipment not found or already booked');
        }
        return db_1.default.bid.create({
            data: {
                amount,
                deliveryEstimate: deliveryDate,
                shipmentId,
                carrierId
            }
        });
    }
    async getCarrierBids(carrierId) {
        return db_1.default.bid.findMany({
            where: { carrierId },
            include: {
                shipment: true
            }
        });
    }
    async getEarningsStats(carrierId) {
        const [delivered, inTransit, totalEarned, potentialEarned, recentTransactions] = await Promise.all([
            // Delivered Count
            db_1.default.booking.count({
                where: { carrierId, status: 'COMPLETED' }
            }),
            // In Transit / Confirmed Count
            db_1.default.booking.count({
                where: { carrierId, status: { in: ['CONFIRMED', 'IN_TRANSIT'] } }
            }),
            // Total Earned
            db_1.default.booking.aggregate({
                _sum: { price: true },
                where: { carrierId, status: 'COMPLETED' }
            }),
            // Potential Earned
            db_1.default.booking.aggregate({
                _sum: { price: true },
                where: { carrierId, status: { in: ['CONFIRMED', 'IN_TRANSIT'] } }
            }),
            // Recent Transactions
            db_1.default.booking.findMany({
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
            recentTransactions: recentTransactions.map((bt) => ({
                id: bt.id,
                title: bt.shipment.title,
                amount: Number(bt.price),
                status: bt.status,
                createdAt: bt.createdAt
            }))
        };
    }
}
exports.CarrierService = CarrierService;
