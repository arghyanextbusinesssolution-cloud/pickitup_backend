import { adminRepository } from './admin.repository';

export class AdminService {
    async getPlatformStats() {
        return adminRepository.getAnalytics();
    }
}
