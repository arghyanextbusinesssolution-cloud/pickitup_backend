import { disputeRepository } from './dispute.repository';

export class DisputeService {
    async openDispute(bookingId: string, reason: string, userId: string) {
        return disputeRepository.createDispute({ bookingId, reason, userId, status: 'OPEN' });
    }

    async getAllDisputes() {
        return disputeRepository.findMany();
    }
}
