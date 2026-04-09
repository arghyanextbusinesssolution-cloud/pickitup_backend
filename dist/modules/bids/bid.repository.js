"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bidRepository = exports.BidRepository = void 0;
const db_1 = __importDefault(require("../../config/db"));
class BidRepository {
    async create(data) {
        return db_1.default.bid.create({
            data: {
                amount: data.amount,
                deliveryEstimate: data.deliveryEstimate,
                shipmentId: data.shipmentId,
                carrierId: data.carrierId,
            }
        });
    }
    async findById(id) {
        return db_1.default.bid.findUnique({
            where: { id },
            include: { carrier: true, shipment: true }
        });
    }
    async findManyByShipment(shipmentId) {
        return db_1.default.bid.findMany({
            where: { shipmentId },
            include: { carrier: true }
        });
    }
    async findManyByCarrier(carrierId) {
        return db_1.default.bid.findMany({
            where: { carrierId },
            include: { shipment: true }
        });
    }
    async updateStatus(id, status) {
        return db_1.default.bid.update({
            where: { id },
            data: { status }
        });
    }
}
exports.BidRepository = BidRepository;
exports.bidRepository = new BidRepository();
