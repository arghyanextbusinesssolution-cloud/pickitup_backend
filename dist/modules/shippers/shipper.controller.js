"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shipperController = exports.ShipperController = void 0;
const shipper_service_1 = require("./shipper.service");
class ShipperController {
    async getPaymentStats(req, res) {
        try {
            // Verify ownership if needed, but here we use the authenticated user ID
            const stats = await shipper_service_1.shipperService.getPaymentStats(req.user.id);
            res.status(200).json(stats);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.ShipperController = ShipperController;
exports.shipperController = new ShipperController();
