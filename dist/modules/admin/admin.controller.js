"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = exports.AdminController = void 0;
const admin_service_1 = require("./admin.service");
const adminService = new admin_service_1.AdminService();
class AdminController {
    async getStats(req, res) {
        try {
            const stats = await adminService.getPlatformStats();
            res.status(200).json(stats);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.AdminController = AdminController;
exports.adminController = new AdminController();
