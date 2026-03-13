"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingController = exports.BookingController = void 0;
const booking_service_1 = require("./booking.service");
const bookingService = new booking_service_1.BookingService();
class BookingController {
    async create(req, res) {
        try {
            const { shipmentId, carrierId, price } = req.body;
            const result = await bookingService.create(shipmentId, carrierId, price);
            res.status(201).json(result);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async getMyBookings(req, res) {
        try {
            const result = await bookingService.getMyBookings(req.user.userId, req.user.role);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.BookingController = BookingController;
exports.bookingController = new BookingController();
