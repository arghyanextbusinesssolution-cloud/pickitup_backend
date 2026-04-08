import { reviewRepository } from './review.repository';

export class ReviewService {
    async create(rating: number, comment: string, fromId: string, toId: string, shipmentId: string) {
        return reviewRepository.create(rating, comment, fromId, toId, shipmentId);
    }

    async getReviewsForUser(userId: string) {
        return reviewRepository.findManyByToUser(userId);
    }
}
