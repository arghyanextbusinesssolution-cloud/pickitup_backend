"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
const authService = new auth_service_1.AuthService();
class AuthController {
    async register(req, res) {
        try {
            console.log("[Auth Controller] Registration attempt:", req.body);
            const result = await authService.register(req.body);
            console.log("[Auth Controller] Registration success for:", result.user.email);
            res.status(201).json(result);
        }
        catch (error) {
            console.error("[Auth Controller] Registration failed:", error);
            res.status(400).json({ error: error.message });
        }
    }
    async login(req, res) {
        try {
            const result = await authService.login(req.body);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(401).json({ error: error.message });
        }
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
