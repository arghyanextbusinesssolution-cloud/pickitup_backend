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
        // Map 'USER' role to 'SHIPPER' to match Prisma enum
        const role = data.role === 'USER' ? 'SHIPPER' : data.role;
        console.log('[AuthRepository] Creating user in DB with role:', role);
        return db_1.default.user.create({
            data: {
                email: data.email,
                passwordHash: hashedPassword,
                firstName: data.firstName,
                lastName: data.lastName,
                role: role
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
