import prisma from '../../config/db';

export class ReviewRepository {
    async create(rating: number, comment: string, fromId: string, toId: string) {
        return prisma.review.create({
            data: { rating, comment, fromId, toId }
        });
    }

    async findManyByToUser(toId: string) {
        return prisma.review.findMany({
            where: { toId },
            include: {
                from: {
                    select: { firstName: true, lastName: true }
                }
            }
        });
    }
}

export const reviewRepository = new ReviewRepository();
