import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { UserService } from './user.service';

const userService = new UserService();

export class UserController {
    async getProfile(req: AuthRequest, res: Response) {
        try {
            const user = await userService.findById(req.user!.id);
            if (!user) return res.status(404).json({ error: 'User not found' });
            res.status(200).json(user);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async update(req: AuthRequest, res: Response) {
        try {
            const result = await userService.updateProfile(req.user!.id, req.body);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}

export const userController = new UserController();
