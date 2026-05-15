"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const admin_repository_1 = require("./admin.repository");
class AdminService {
    async getPlatformStats() {
        return admin_repository_1.adminRepository.getAnalytics();
    }
    async getChartData() {
        return admin_repository_1.adminRepository.getChartData();
    }
    async getClaims() {
        return admin_repository_1.adminRepository.getClaims();
    }
    async updateClaimStatus(id, status) {
        return admin_repository_1.adminRepository.updateClaimStatus(id, status);
    }
    async getUsers() {
        return admin_repository_1.adminRepository.getUsersWithMetrics();
    }
    async getUserById(id) {
        return admin_repository_1.adminRepository.getUserByIdWithMetrics(id);
    }
    async getCarriers() {
        return admin_repository_1.adminRepository.getCarriersWithMetrics();
    }
    async getCarrierById(id) {
        return admin_repository_1.adminRepository.getCarrierByIdWithMetrics(id);
    }
    async getTransactions() {
        return admin_repository_1.adminRepository.getTransactionsWithMetrics();
    }
    async getShipments() {
        return await admin_repository_1.adminRepository.getShipmentsWithTracking();
    }
    async getLiveParcels() {
        return await admin_repository_1.adminRepository.getLiveParcels();
    }
}
exports.AdminService = AdminService;
