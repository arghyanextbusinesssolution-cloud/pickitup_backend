"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bidController = exports.BidController = void 0;
const bid_service_1 = require("./bid.service");
const db_1 = __importDefault(require("../../config/db"));
const bidService = new bid_service_1.BidService();
class BidController {
    async create(req, res) {
        try {
            const { shipmentId, amount, deliveryDate } = req.body;
            const carrier = await db_1.default.carrier.findUnique({ where: { userId: req.user.userId } });
            if (!carrier)
                return res.status(403).json({ error: 'Not a carrier' });
            const result = await bidService.placeBid(amount, deliveryDate, shipmentId, carrier.id);
            res.status(201).json(result);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async getShipmentBids(req, res) {
        try {
            const result = await bidService.getShipmentBids(req.params.shipmentId);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getMyBids(req, res) {
        try {
            const carrier = await db_1.default.carrier.findUnique({ where: { userId: req.user.userId } });
            if (!carrier)
                return res.status(403).json({ error: 'Not a carrier' });
            const result = await bidService.getCarrierBids(carrier.id);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.BidController = BidController;
exports.bidController = new BidController();
