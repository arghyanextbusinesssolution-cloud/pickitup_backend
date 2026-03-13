"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = exports.UserRepository = void 0;
const db_1 = __importDefault(require("../../config/db"));
class UserRepository {
    async findById(id) {
        return db_1.default.user.findUnique({
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
    async update(id, data) {
        return db_1.default.user.update({
            where: { id },
            data
        });
    }
    async findCarrierByUserId(userId) {
        return db_1.default.carrier.findUnique({
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
exports.UserRepository = UserRepository;
exports.userRepository = new UserRepository();
