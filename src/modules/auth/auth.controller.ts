import { Request, Response } from 'express';
import { AuthService } from './auth.service';

const authService = new AuthService();

export class AuthController {
    async register(req: Request, res: Response) {
        try {
            console.log('[Auth Controller] Registration attempt:', req.body);
            const result = await authService.register(req.body);
            console.log('[Auth Controller] Registration success for:', result.user.email);
            res.status(201).json(result);
        } catch (error: any) {
            console.error('[Auth Controller] Registration failed:', error);
            if (error.code === 'P2002' && error.meta?.target) {
                const target = error.meta.target;
                const field = Array.isArray(target) ? target[0] : target;
                return res.status(400).json({ error: `This ${field} is already registered.` });
            }
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

    async sendEmailOtp(req: Request, res: Response) {
        try {
            const { email, name } = req.body;
            if (!email || !name) {
                return res.status(400).json({ error: 'email and name are required' });
            }
            await authService.sendEmailOtp(email, name);
            res.status(200).json({ message: 'OTP sent successfully' });
        } catch (error: any) {
            console.error('[Auth Controller] Send OTP failed:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async verifyEmailOtp(req: Request, res: Response) {
        try {
            const { email, code } = req.body;
            if (!email || !code) {
                return res.status(400).json({ error: 'email and code are required' });
            }
            await authService.verifyEmailOtp(email, code);
            res.status(200).json({ message: 'Email verified successfully', verified: true });
        } catch (error: any) {
            console.error('[Auth Controller] Verify OTP failed:', error);
            res.status(400).json({ error: error.message });
        }
    }
}

export const authController = new AuthController();
