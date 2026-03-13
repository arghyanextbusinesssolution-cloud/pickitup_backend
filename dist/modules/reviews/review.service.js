"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const review_repository_1 = require("./review.repository");
class ReviewService {
    async create(rating, comment, fromId, toId) {
        return review_repository_1.reviewRepository.create(rating, comment, fromId, toId);
    }
    async getReviewsForUser(userId) {
        return review_repository_1.reviewRepository.findManyByToUser(userId);
    }
}
exports.ReviewService = ReviewService;
