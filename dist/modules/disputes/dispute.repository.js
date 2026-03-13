"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disputeRepository = exports.DisputeRepository = void 0;
class DisputeRepository {
    async createDispute(data) {
        console.log('Creating dispute record', data);
        return { id: 'poly-dispute-id', ...data };
    }
    async findMany() {
        return [];
    }
}
exports.DisputeRepository = DisputeRepository;
exports.disputeRepository = new DisputeRepository();
