import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { ReviewService } from './review.service';

const reviewService = new ReviewService();

export class ReviewController {
    async create(req: AuthRequest, res: Response) {
        try {
            const { rating, comment, toId, shipmentId } = req.body;
            const result = await reviewService.create(rating, comment, req.user!.id, toId, shipmentId);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async getUserReviews(req: AuthRequest, res: Response) {
        try {
            const result = await reviewService.getReviewsForUser(req.params.userId as string);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getMyReviews(req: AuthRequest, res: Response) {
        try {
            const result = await reviewService.getReviewsForUser(req.user!.id);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

export const reviewController = new ReviewController();
