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
        if (data.role === 'CARRIER' && data.companyName) {
            await auth_repository_1.authRepository.createCarrier(data.companyName, user.id);
        }
        return this.generateToken(user.id, user.email, user.role);
    }
    async login(data) {
        const user = await auth_repository_1.authRepository.findByEmail(data.email);
        if (!user || !(await bcryptjs_1.default.compare(data.password, user.password))) {
            throw new Error('Invalid credentials');
        }
        return this.generateToken(user.id, user.email, user.role);
    }
    generateToken(userId, email, role) {
        const secret = env_1.env.JWT_SECRET;
        const token = jsonwebtoken_1.default.sign({ userId, email, role }, secret, { expiresIn: '1d' });
        return { token, user: { userId, email, role } };
    }
}
exports.AuthService = AuthService;
