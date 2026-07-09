import prisma from '../../config/db';

export class EnquiryRepository {
    async create(data: {
        name: string;
        email: string;
        inquiryType: string;
        message: string;
    }) {
        return prisma.contactEnquiry.create({ data });
    }

    async findAll() {
        return prisma.contactEnquiry.findMany({
            where: { deletedAt: null },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findById(id: string) {
        return prisma.contactEnquiry.findUnique({
            where: { id }
        });
    }

    async updateStatus(id: string, status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED') {
        return prisma.contactEnquiry.update({
            where: { id },
            data: { status }
        });
    }

    async countNew() {
        return prisma.contactEnquiry.count({ where: { status: 'NEW', deletedAt: null } });
    }
}

export const enquiryRepository = new EnquiryRepository();
