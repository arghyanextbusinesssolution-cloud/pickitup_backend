import prisma from '../../config/db';

export class CarrierRepository {
    async findByUserId(userId: string) {
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

    async findById(id: string) {
        return prisma.carrier.findUnique({ where: { id } });
    }
}

export const carrierRepository = new CarrierRepository();
