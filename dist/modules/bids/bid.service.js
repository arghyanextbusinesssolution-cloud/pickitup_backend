"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BidService = void 0;
const bid_repository_1 = require("./bid.repository");
const booking_repository_1 = require("../bookings/booking.repository");
const db_1 = __importDefault(require("../../config/db"));
class BidService {
    async placeBid(amount, deliveryEstimate, shipmentId, carrierId) {
        const shipment = await db_1.default.shipment.findUnique({ where: { id: shipmentId } });
        if (!shipment || shipment.status !== 'OPEN') {
            throw new Error('Shipment not found or already booked');
        }
        return bid_repository_1.bidRepository.create({ amount, deliveryEstimate, shipmentId, carrierId });
    }
    async acceptBid(bidId, shipperId) {
        // Fetch the bid with shipment to validate ownership and status
        const bid = await db_1.default.bid.findUnique({
            where: { id: bidId },
            include: { shipment: true }
        });
        if (!bid)
            throw new Error('Bid not found');
        if (bid.shipment.ownerId !== shipperId)
            throw new Error('Not authorized to accept this bid');
        if (bid.shipment.status !== 'OPEN')
            throw new Error('Shipment is no longer open for bidding');
        // Atomically: create booking, accept bid, reject others, lock shipment
        const booking = await booking_repository_1.bookingRepository.create(bid.shipmentId, bid.carrierId, Number(bid.amount), bid.id);
        return booking;
    }
    async getShipmentBids(shipmentId) {
        return bid_repository_1.bidRepository.findManyByShipment(shipmentId);
    }
    async getCarrierBids(carrierId) {
        return bid_repository_1.bidRepository.findManyByCarrier(carrierId);
    }
    async getBidById(bidId) {
        return db_1.default.bid.findUnique({
            where: { id: bidId },
            include: {
                shipment: true,
                booking: {
                    include: {
                        payments: true
                    }
                }
            }
        });
    }
}
exports.BidService = BidService;
