"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRepository = exports.AdminRepository = void 0;
const db_1 = __importDefault(require("../../config/db"));
class AdminRepository {
    async getAnalytics() {
        const userCount = await db_1.default.user.count();
        const shipmentCount = await db_1.default.shipment.count();
        const bookingCount = await db_1.default.booking.count();
        return { userCount, shipmentCount, bookingCount };
    }
}
exports.AdminRepository = AdminRepository;
exports.adminRepository = new AdminRepository();
