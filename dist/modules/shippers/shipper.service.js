"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shipperService = exports.ShipperService = void 0;
const db_1 = __importDefault(require("../../config/db"));
class ShipperService {
    async getPaymentStats(ownerId) {
        const [totalSpent, inEscrow, totalShipments, completedCount, recentPayments] = await Promise.all([
            // Total Spent (Completed Bookings)
            db_1.default.booking.aggregate({
                _sum: { price: true },
                where: { shipment: { ownerId }, status: 'COMPLETED' }
            }),
            // In Escrow (Confirmed or In Transit)
            db_1.default.booking.aggregate({
                _sum: { price: true },
                where: { shipment: { ownerId }, status: { in: ['CONFIRMED', 'IN_TRANSIT'] } }
            }),
            // Total Shipments
            db_1.default.shipment.count({
                where: { ownerId }
            }),
            // Completed Shipments
            db_1.default.shipment.count({
                where: { ownerId, status: 'DELIVERED' }
            }),
            // Recent Payments/Bookings
            db_1.default.booking.findMany({
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
            recentPayments: recentPayments.map((p) => ({
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
exports.ShipperService = ShipperService;
exports.shipperService = new ShipperService();
