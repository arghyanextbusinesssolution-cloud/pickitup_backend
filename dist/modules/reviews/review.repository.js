"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRepository = exports.ReviewRepository = void 0;
const db_1 = __importDefault(require("../../config/db"));
class ReviewRepository {
    async create(rating, comment, fromUserId, toUserId, shipmentId) {
        return db_1.default.review.create({
            data: { rating, comment, fromUserId, toUserId, shipmentId }
        });
    }
    async findManyByToUser(toUserId) {
        return db_1.default.review.findMany({
            where: { toUserId },
            include: {
                fromUser: {
                    select: { firstName: true, lastName: true }
                }
            }
        });
    }
}
exports.ReviewRepository = ReviewRepository;
exports.reviewRepository = new ReviewRepository();
