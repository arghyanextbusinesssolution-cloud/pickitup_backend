"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_repository_1 = require("./auth.repository");
const env_1 = require("../../config/env");
class AuthService {
    async register(data) {
        const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
        const user = await auth_repository_1.authRepository.createUser(data, hashedPassword);
        if (data.role === 'CARRIER') {
            const companyName = data.companyName || `${data.firstName || 'Carrier'} Transport`;
            await auth_repository_1.authRepository.createCarrier(companyName, user.id);
        }
        return this.generateToken(user);
    }
    async login(data) {
        const user = await auth_repository_1.authRepository.findByEmail(data.email);
        if (!user || !(await bcryptjs_1.default.compare(data.password, user.passwordHash))) {
            throw new Error('Invalid credentials');
        }
        return this.generateToken(user);
    }
    generateToken(user) {
        const secret = env_1.env.JWT_SECRET;
        const payload = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
        };
        const token = jsonwebtoken_1.default.sign(payload, secret, { expiresIn: '1d' });
        return { token, user: payload };
    }
}
exports.AuthService = AuthService;
