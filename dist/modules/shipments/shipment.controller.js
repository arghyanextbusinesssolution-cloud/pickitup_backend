"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shipmentController = exports.ShipmentController = void 0;
const shipment_service_1 = require("./shipment.service");
const shipmentService = new shipment_service_1.ShipmentService();
class ShipmentController {
    async create(req, res) {
        try {
            const result = await shipmentService.create(req.body, req.user.userId);
            res.status(201).json(result);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async getMyShipments(req, res) {
        try {
            const result = await shipmentService.findByOwner(req.user.userId);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getAvailableShipments(req, res) {
        try {
            const result = await shipmentService.findAvailable();
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getCarrierJobs(req, res) {
        try {
            const result = await shipmentService.findCarrierJobs(req.user.userId);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getAll(req, res) {
        try {
            const result = await shipmentService.findAll();
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getOne(req, res) {
        try {
            const result = await shipmentService.findOne(req.params.id);
            if (!result)
                return res.status(404).json({ error: 'Shipment not found' });
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async update(req, res) {
        try {
            const result = await shipmentService.update(req.params.id, req.body, req.user.userId);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(401).json({ error: error.message });
        }
    }
    async delete(req, res) {
        try {
            await shipmentService.delete(req.params.id, req.user.userId);
            res.status(204).send();
        }
        catch (error) {
            res.status(401).json({ error: error.message });
        }
    }
}
exports.ShipmentController = ShipmentController;
exports.shipmentController = new ShipmentController();
