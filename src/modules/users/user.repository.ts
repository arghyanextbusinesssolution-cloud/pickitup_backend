import prisma from '../../config/db';

export class UserRepository {
    async findById(id: string) {
        return prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                carrier: true
            }
        });
    }

    async update(id: string, data: any) {
        return prisma.user.update({
            where: { id },
            data
        });
    }

    async findCarrierByUserId(userId: string) {
        return prisma.carrier.findUnique({
            where: { userId },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                },
                bids: {
                    include: {
                        shipment: true
                    }
                }
            }
        });
    }
}

export const userRepository = new UserRepository();
