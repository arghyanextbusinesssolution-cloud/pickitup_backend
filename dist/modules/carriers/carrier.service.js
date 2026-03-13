"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarrierService = void 0;
const carrier_repository_1 = require("./carrier.repository");
const db_1 = __importDefault(require("../../config/db")); // Still used for non-carrier specific bid creation if needed, or move to bid repo
class CarrierService {
    async findProfile(userId) {
        return carrier_repository_1.carrierRepository.findByUserId(userId);
    }
    async placeBid(carrierId, shipmentId, amount, deliveryDate) {
        const shipment = await db_1.default.shipment.findUnique({ where: { id: shipmentId } });
        if (!shipment || shipment.status !== 'PENDING') {
            throw new Error('Shipment not found or already booked');
        }
        return db_1.default.bid.create({
            data: {
                amount,
                deliveryDate,
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
}
exports.CarrierService = CarrierService;
