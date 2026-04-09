"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shipmentController = exports.ShipmentController = void 0;
const shipment_service_1 = require("./shipment.service");
const shipment_types_1 = require("./shipment.types");
const shipmentService = new shipment_service_1.ShipmentService();
class ShipmentController {
    async create(req, res) {
        try {
            console.log("[Shipment Controller] Validate creation for:", req.user.email);
            // Validate input
            const validatedData = shipment_types_1.CreateShipmentSchema.parse(req.body);
            const result = await shipmentService.create(validatedData, req.user.id);
            res.status(201).json(result);
        }
        catch (error) {
            console.error("[Shipment Controller] Validation/Creation failed:", error);
            if (error.errors) {
                return res.status(400).json({ error: 'Validation failed', details: error.errors });
            }
            res.status(400).json({ error: error.message });
        }
    }
    async getMyShipments(req, res) {
        try {
            const result = await shipmentService.findByOwner(req.user.id);
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
            const result = await shipmentService.findCarrierJobs(req.user.id);
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
            // Validate partially
            const validatedData = shipment_types_1.UpdateShipmentSchema.parse(req.body);
            const result = await shipmentService.update(req.params.id, validatedData, req.user.id);
            res.status(200).json(result);
        }
        catch (error) {
            if (error.errors) {
                return res.status(400).json({ error: 'Validation failed', details: error.errors });
            }
            const isForbidden = error.message?.startsWith('FORBIDDEN');
            res.status(isForbidden ? 403 : 400).json({ error: error.message });
        }
    }
    async delete(req, res) {
        try {
            await shipmentService.delete(req.params.id, req.user.id);
            res.status(204).send();
        }
        catch (error) {
            res.status(403).json({ error: error.message });
        }
    }
}
exports.ShipmentController = ShipmentController;
exports.shipmentController = new ShipmentController();
