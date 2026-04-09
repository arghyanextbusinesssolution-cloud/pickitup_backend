"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disputeController = exports.DisputeController = void 0;
const dispute_service_1 = require("./dispute.service");
const disputeService = new dispute_service_1.DisputeService();
class DisputeController {
    async create(req, res) {
        try {
            const { bookingId, reason } = req.body;
            const result = await disputeService.openDispute(bookingId, reason, req.user.id);
            res.status(201).json(result);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async getAll(req, res) {
        try {
            const result = await disputeService.getAllDisputes();
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.DisputeController = DisputeController;
exports.disputeController = new DisputeController();
