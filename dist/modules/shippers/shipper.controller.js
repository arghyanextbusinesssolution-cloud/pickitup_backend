"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shipperController = exports.ShipperController = void 0;
const shipper_service_1 = require("./shipper.service");
class ShipperController {
    async getPaymentStats(req, res) {
        try {
            const stats = await shipper_service_1.shipperService.getPaymentStats(req.user.id);
            res.status(200).json(stats);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async updatePhone(req, res) {
        try {
            const { phone } = req.body;
            if (!phone)
                return res.status(400).json({ error: 'phone is required' });
            const result = await shipper_service_1.shipperService.updatePhone(req.user.id, phone);
            res.status(200).json({ message: 'Phone updated', user: result });
        }
        catch (error) {
            if (error.code === 'P2002' && error.meta?.target) {
                return res.status(400).json({ error: 'This phone number is already registered.' });
            }
            res.status(500).json({ error: error.message });
        }
    }
    async addAddress(req, res) {
        try {
            const { addressLine1, city, state, country, postalCode } = req.body;
            if (!addressLine1 || !city || !country) {
                return res.status(400).json({ error: 'addressLine1, city, and country are required' });
            }
            const result = await shipper_service_1.shipperService.addAddress(req.user.id, {
                addressLine1,
                city,
                state: state || '',
                country,
                postalCode: postalCode || ''
            });
            res.status(201).json({ message: 'Address saved. Profile complete.', address: result });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.ShipperController = ShipperController;
exports.shipperController = new ShipperController();
