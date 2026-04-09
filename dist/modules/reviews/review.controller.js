"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewController = exports.ReviewController = void 0;
const review_service_1 = require("./review.service");
const reviewService = new review_service_1.ReviewService();
class ReviewController {
    async create(req, res) {
        try {
            const { rating, comment, toId, shipmentId } = req.body;
            const result = await reviewService.create(rating, comment, req.user.id, toId, shipmentId);
            res.status(201).json(result);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async getUserReviews(req, res) {
        try {
            const result = await reviewService.getReviewsForUser(req.params.userId);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getMyReviews(req, res) {
        try {
            const result = await reviewService.getReviewsForUser(req.user.id);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.ReviewController = ReviewController;
exports.reviewController = new ReviewController();
