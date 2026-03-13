"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const admin_repository_1 = require("./admin.repository");
class AdminService {
    async getPlatformStats() {
        return admin_repository_1.adminRepository.getAnalytics();
    }
}
exports.AdminService = AdminService;
