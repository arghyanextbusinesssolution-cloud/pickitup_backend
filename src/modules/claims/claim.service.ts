import { claimRepository } from './claim.repository';

export class ClaimService {
    async openClaim(bookingId: string, reason: string, userId: string, photos: string[] = []) {
        return claimRepository.create({ bookingId, reason, raisedById: userId, photos });
    }

    async getAllClaims() {
        return claimRepository.findMany();
    }

    async getClaimById(id: string) {
        return claimRepository.findById(id);
    }

    async getEligibleBookings(userId: string) {
        return claimRepository.findEligibleForClaim(userId);
    }

    async updateClaimStatus(id: string, status: string) {
        return claimRepository.updateStatus(id, status);
    }
}

export const claimService = new ClaimService();
