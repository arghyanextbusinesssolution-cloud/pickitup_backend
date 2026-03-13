"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingRepository = exports.BookingRepository = void 0;
const db_1 = __importDefault(require("../../config/db"));
class BookingRepository {
    async create(shipmentId, carrierId, price) {
        return db_1.default.$transaction(async (tx) => {
            const booking = await tx.booking.create({
                data: {
                    shipmentId,
                    carrierId,
                    price,
                    status: 'CONFIRMED'
                }
            });
            await tx.shipment.update({
                where: { id: shipmentId },
                data: { status: 'BOOKED' }
            });
            await tx.bid.updateMany({
                where: { shipmentId, carrierId },
                data: { status: 'ACCEPTED' }
            });
            await tx.bid.updateMany({
                where: { shipmentId, NOT: { carrierId } },
                data: { status: 'REJECTED' }
            });
            return booking;
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
