"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRepository = exports.AdminRepository = void 0;
const db_1 = __importDefault(require("../../config/db"));
class AdminRepository {
    async getAnalytics() {
        const userCount = await db_1.default.user.count({ where: { role: 'SHIPPER' } });
        const carrierCount = await db_1.default.carrier.count();
        const activeShipmentCount = await db_1.default.shipment.count({
            where: {
                status: { in: ['ASSIGNED', 'IN_TRANSIT'] }
            }
        });
        const platformEarnings = await db_1.default.platformCommission.aggregate({
            _sum: { amount: true }
        });
        const payoutSum = platformEarnings._sum.amount || 0;
        return { userCount, carrierCount, activeShipmentCount, payoutSum, shipmentCount: await db_1.default.shipment.count(), bookingCount: await db_1.default.booking.count() };
    }
    async getClaims() {
        return db_1.default.booking.findMany({
            where: {
                OR: [
                    { hasInsurance: true },
                    { isDamaged: true }
                ]
            },
            include: {
                shipment: true,
                carrier: { include: { user: true } }
            }
        });
    }
}
exports.AdminRepository = AdminRepository;
exports.adminRepository = new AdminRepository();
