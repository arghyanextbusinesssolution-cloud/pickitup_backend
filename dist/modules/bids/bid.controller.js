"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bidController = exports.BidController = void 0;
const bid_service_1 = require("./bid.service");
const db_1 = __importDefault(require("../../config/db"));
const bidService = new bid_service_1.BidService();
// Helper: get or auto-create Carrier profile for a CARRIER role user
async function getOrCreateCarrier(userId) {
    let carrier = await db_1.default.carrier.findUnique({ where: { userId } });
    if (!carrier) {
        const user = await db_1.default.user.findUnique({ where: { id: userId } });
        if (!user || user.role !== 'CARRIER')
            return null;
        carrier = await db_1.default.carrier.create({
            data: {
                userId,
                companyName: `${user.firstName || 'Carrier'} Transport`,
            }
        });
    }
    return carrier;
}
class BidController {
    async create(req, res) {
        try {
            const { shipmentId, amount, deliveryDate } = req.body;
            const carrier = await getOrCreateCarrier(req.user.id);
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
            const carrier = await getOrCreateCarrier(req.user.id);
            if (!carrier)
                return res.status(403).json({ error: 'Not a carrier' });
            const result = await bidService.getCarrierBids(carrier.id);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async acceptBid(req, res) {
        try {
            const bidId = req.params.bidId;
            const booking = await bidService.acceptBid(bidId, req.user.id);
            res.status(201).json(booking);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async getById(req, res) {
        try {
            const bid = await bidService.getBidById(req.params.bidId);
            if (!bid)
                return res.status(404).json({ error: 'Bid not found' });
            res.status(200).json(bid);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.BidController = BidController;
exports.bidController = new BidController();
