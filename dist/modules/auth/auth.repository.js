"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRepository = exports.AuthRepository = void 0;
const db_1 = __importDefault(require("../../config/db"));
class AuthRepository {
    async findByEmail(email) {
        return db_1.default.user.findUnique({ where: { email } });
    }
    async createUser(data, hashedPassword) {
        return db_1.default.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                firstName: data.firstName,
                lastName: data.lastName,
                role: data.role
            }
        });
    }
    async createCarrier(companyName, userId) {
        return db_1.default.carrier.create({
            data: {
                companyName,
                userId
            }
        });
    }
}
exports.AuthRepository = AuthRepository;
exports.authRepository = new AuthRepository();
