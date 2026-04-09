"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingController = exports.BookingController = void 0;
const booking_service_1 = require("./booking.service");
const bookingService = new booking_service_1.BookingService();
class BookingController {
    async create(req, res) {
        try {
            const { shipmentId, carrierId, price, bidId } = req.body;
            if (!bidId)
                throw new Error("bidId is required");
            const result = await bookingService.create(shipmentId, carrierId, price, bidId);
            res.status(201).json(result);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async getById(req, res) {
        try {
            const result = await bookingService.getById(req.params.id);
            if (!result)
                return res.status(404).json({ error: 'Booking not found' });
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getMyBookings(req, res) {
        try {
            const result = await bookingService.getMyBookings(req.user.id, req.user.role);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async verifyPickupOtp(req, res) {
        try {
            const { otp } = req.body;
            const result = await bookingService.verifyPickupOtp(req.params.id, otp);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async verifyDeliveryOtp(req, res) {
        try {
            const { otp } = req.body;
            const result = await bookingService.verifyDeliveryOtp(req.params.id, otp);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.BookingController = BookingController;
exports.bookingController = new BookingController();
