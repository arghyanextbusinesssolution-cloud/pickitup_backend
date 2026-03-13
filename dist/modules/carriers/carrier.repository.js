"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.carrierRepository = exports.CarrierRepository = void 0;
const db_1 = __importDefault(require("../../config/db"));
class CarrierRepository {
    async findByUserId(userId) {
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
    async findById(id) {
        return db_1.default.carrier.findUnique({ where: { id } });
    }
}
exports.CarrierRepository = CarrierRepository;
exports.carrierRepository = new CarrierRepository();
