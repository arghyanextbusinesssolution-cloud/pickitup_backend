"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const booking_repository_1 = require("./booking.repository");
const db_1 = __importDefault(require("../../config/db"));
class BookingService {
    async create(shipmentId, carrierId, price) {
        return booking_repository_1.bookingRepository.create(shipmentId, carrierId, price);
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
}
exports.BookingService = BookingService;
