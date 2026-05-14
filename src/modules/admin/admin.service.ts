import { adminRepository } from './admin.repository';

export class AdminService {
    async getPlatformStats() {
        return adminRepository.getAnalytics();
    }

    async getChartData() {
        return adminRepository.getChartData();
    }

    async getClaims() {
        return adminRepository.getClaims();
    }

    async updateClaimStatus(id: string, status: string) {
        return adminRepository.updateClaimStatus(id, status);
    }

    async getUsers() {
        return adminRepository.getUsersWithMetrics();
    }

    async getUserById(id: string) {
        return adminRepository.getUserByIdWithMetrics(id);
    }

    async getCarriers() {
        return adminRepository.getCarriersWithMetrics();
    }

    async getCarrierById(id: string) {
        return adminRepository.getCarrierByIdWithMetrics(id);
    }

    async getTransactions() {
        return adminRepository.getTransactionsWithMetrics();
    }

    async getShipments() {
        return await adminRepository.getShipmentsWithTracking();
    }

    async getLiveParcels() {
        return await adminRepository.getLiveParcels();
    }
}
