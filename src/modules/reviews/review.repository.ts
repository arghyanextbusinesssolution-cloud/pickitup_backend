import prisma from '../../config/db';

export class ReviewRepository {
    async create(rating: number, comment: string, fromUserId: string, toUserId: string, shipmentId: string) {
        return prisma.review.create({
            data: { rating, comment, fromUserId, toUserId, shipmentId }
        });
    }

    async findManyByToUser(toUserId: string) {
        return prisma.review.findMany({
            where: { toUserId },
            include: {
                fromUser: {
                    select: { firstName: true, lastName: true }
                }
            }
        });
    }
}

export const reviewRepository = new ReviewRepository();
