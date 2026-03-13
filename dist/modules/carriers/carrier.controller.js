"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.carrierController = exports.CarrierController = void 0;
const carrier_service_1 = require("./carrier.service");
const carrierService = new carrier_service_1.CarrierService();
class CarrierController {
    async getProfile(req, res) {
        try {
            const result = await carrierService.findProfile(req.user.userId);
            if (!result)
                return res.status(404).json({ error: 'Carrier profile not found' });
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async placeBid(req, res) {
        try {
            const { shipmentId, amount, deliveryDate } = req.body;
            const carrier = await carrierService.findProfile(req.user.userId);
            if (!carrier)
                return res.status(403).json({ error: 'Not a carrier' });
            const result = await carrierService.placeBid(carrier.id, shipmentId, amount, deliveryDate);
            res.status(201).json(result);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async getMyBids(req, res) {
        try {
            const carrier = await carrierService.findProfile(req.user.userId);
            if (!carrier)
                return res.status(403).json({ error: 'Not a carrier' });
            const result = await carrierService.getCarrierBids(carrier.id);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.CarrierController = CarrierController;
exports.carrierController = new CarrierController();
