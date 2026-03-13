"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BidService = void 0;
const bid_repository_1 = require("./bid.repository");
const db_1 = __importDefault(require("../../config/db"));
class BidService {
    async placeBid(amount, deliveryDate, shipmentId, carrierId) {
        const shipment = await db_1.default.shipment.findUnique({ where: { id: shipmentId } });
        if (!shipment || shipment.status !== 'PENDING') {
            throw new Error('Shipment not found or already booked');
        }
        return bid_repository_1.bidRepository.create({ amount, deliveryDate, shipmentId, carrierId });
    }
    async getShipmentBids(shipmentId) {
        return bid_repository_1.bidRepository.findManyByShipment(shipmentId);
    }
    async getCarrierBids(carrierId) {
        return bid_repository_1.bidRepository.findManyByCarrier(carrierId);
    }
}
exports.BidService = BidService;
