import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authRepository } from './auth.repository';
import { RegisterDto, LoginDto } from './auth.types';
import { env } from '../../config/env';

export class AuthService {
    async register(data: RegisterDto) {
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await authRepository.createUser(data, hashedPassword);

        if (data.role === 'CARRIER' && data.companyName) {
            await authRepository.createCarrier(data.companyName, user.id);
        }

        return this.generateToken(user.id, user.email, user.role);
    }

    async login(data: LoginDto) {
        const user = await authRepository.findByEmail(data.email);

        if (!user || !(await bcrypt.compare(data.password, user.password))) {
            throw new Error('Invalid credentials');
        }

        return this.generateToken(user.id, user.email, user.role);
    }

    private generateToken(userId: string, email: string, role: string) {
        const secret = env.JWT_SECRET;
        const token = jwt.sign({ userId, email, role }, secret, { expiresIn: '1d' });
        return { token, user: { userId, email, role } };
    }
}
