"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingRepository = exports.BookingRepository = void 0;
const client_1 = require("@prisma/client");
const db_1 = __importDefault(require("../../config/db"));
class BookingRepository {
    async create(shipmentId, carrierId, price, bidId) {
        return db_1.default.$transaction(async (tx) => {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const deliveryOtp = Math.floor(100000 + Math.random() * 900000).toString();
            const booking = await tx.booking.create({
                data: {
                    shipmentId,
                    carrierId,
                    bidId,
                    price: new client_1.Prisma.Decimal(price),
                    status: client_1.BookingStatus.CONFIRMED,
                    otp,
                    deliveryOtp
                }
            });
            await tx.shipment.update({
                where: { id: shipmentId },
                data: { status: client_1.ShipmentStatus.ASSIGNED }
            });
            await tx.bid.updateMany({
                where: { shipmentId, carrierId },
                data: { status: client_1.BidStatus.ACCEPTED }
            });
            await tx.bid.updateMany({
                where: { shipmentId, NOT: { carrierId } },
                data: { status: client_1.BidStatus.REJECTED }
            });
            return booking;
        });
    }
    async findById(id) {
        return db_1.default.booking.findUnique({
            where: { id },
            include: {
                shipment: true,
                carrier: { include: { user: true } },
                bid: true,
            }
        });
    }
    async findManyByCarrier(carrierId) {
        return db_1.default.booking.findMany({
            where: { carrierId },
            include: { shipment: true }
        });
    }
    async findManyByOwner(userId) {
        return db_1.default.booking.findMany({
            where: { shipment: { ownerId: userId } },
            include: { carrier: true, shipment: true }
        });
    }
}
exports.BookingRepository = BookingRepository;
exports.bookingRepository = new BookingRepository();
