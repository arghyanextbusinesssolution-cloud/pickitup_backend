"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingService = exports.BookingService = void 0;
const booking_repository_1 = require("./booking.repository");
const db_1 = __importDefault(require("../../config/db"));
const client_1 = require("@prisma/client");
class BookingService {
    async create(shipmentId, carrierId, price, bidId) {
        return booking_repository_1.bookingRepository.create(shipmentId, carrierId, price, bidId);
    }
    async getById(id) {
        return booking_repository_1.bookingRepository.findById(id);
    }
    async getMyBookings(userId, role) {
        if (role === 'CARRIER') {
            const carrier = await db_1.default.carrier.findUnique({ where: { userId } });
            if (!carrier)
                throw new Error('Carrier profile not found');
            return booking_repository_1.bookingRepository.findManyByCarrier(carrier.id);
        }
        else {
            return booking_repository_1.bookingRepository.findManyByOwner(userId);
        }
    }
    async verifyPickupOtp(bookingId, otp) {
        const booking = await booking_repository_1.bookingRepository.findById(bookingId);
        if (!booking)
            throw new Error('Booking not found');
        if (booking.otp !== otp) {
            throw new Error('Invalid pickup OTP code. Please check with the shipper.');
        }
        // Atomically update shipment status
        await db_1.default.$transaction([
            db_1.default.shipment.update({
                where: { id: booking.shipmentId },
                data: { status: client_1.ShipmentStatus.IN_TRANSIT },
            })
        ]);
        return { success: true, status: 'PICKED_UP' };
    }
    async verifyDeliveryOtp(bookingId, otp) {
        const booking = await booking_repository_1.bookingRepository.findById(bookingId);
        if (!booking)
            throw new Error('Booking not found');
        if (booking.deliveryOtp !== otp) {
            throw new Error('Invalid delivery OTP code. Please check with the receiver.');
        }
        await db_1.default.$transaction([
            db_1.default.shipment.update({
                where: { id: booking.shipmentId },
                data: { status: client_1.ShipmentStatus.DELIVERED },
            }),
            db_1.default.booking.update({
                where: { id: bookingId },
                data: { status: client_1.BookingStatus.COMPLETED },
            }),
        ]);
        return { success: true, status: 'DELIVERED' };
    }
    async updateStatus(bookingId, shipmentId, status) {
        const bookingStatusMap = {
            [client_1.ShipmentStatus.IN_TRANSIT]: client_1.BookingStatus.IN_TRANSIT,
            [client_1.ShipmentStatus.DELIVERED]: client_1.BookingStatus.COMPLETED,
        };
        const bookingStatus = bookingStatusMap[status];
        await db_1.default.$transaction([
            db_1.default.shipment.update({
                where: { id: shipmentId },
                data: { status },
            }),
            ...(bookingStatus
                ? [db_1.default.booking.update({ where: { id: bookingId }, data: { status: bookingStatus } })]
                : []),
        ]);
        return { success: true, status };
    }
}
exports.BookingService = BookingService;
exports.bookingService = new BookingService();
