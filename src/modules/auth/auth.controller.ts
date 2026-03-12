import { Request, Response } from 'express';
import { AuthService } from './auth.service';

const authService = new AuthService();

export class AuthController {
    async register(req: Request, res: Response) {
        try {
            console.log("[Auth Controller] Registration attempt:", req.body);
            const result = await authService.register(req.body);
            console.log("[Auth Controller] Registration success for:", result.user.email);
            res.status(201).json(result);
        } catch (error: any) {
            console.error("[Auth Controller] Registration failed:", error);
            res.status(400).json({ error: error.message });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const result = await authService.login(req.body);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(401).json({ error: error.message });
        }
    }
}

export const authController = new AuthController();
