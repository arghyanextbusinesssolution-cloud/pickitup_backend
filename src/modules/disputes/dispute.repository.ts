import prisma from '../../config/db';

export class DisputeRepository {
    async createDispute(data: any) {
        console.log('Creating dispute record', data);
        return { id: 'poly-dispute-id', ...data };
    }

    async findMany() {
        return [];
    }
}

export const disputeRepository = new DisputeRepository();
