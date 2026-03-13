"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisputeService = void 0;
const dispute_repository_1 = require("./dispute.repository");
class DisputeService {
    async openDispute(bookingId, reason, userId) {
        return dispute_repository_1.disputeRepository.createDispute({ bookingId, reason, userId, status: 'OPEN' });
    }
    async getAllDisputes() {
        return dispute_repository_1.disputeRepository.findMany();
    }
}
exports.DisputeService = DisputeService;
