import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authRepository } from './auth.repository';
import { RegisterDto, LoginDto } from './auth.types';
import { env } from '../../config/env';
import { otpService } from './otp.service';

export class AuthService {
    async register(data: RegisterDto) {
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await authRepository.createUser(data, hashedPassword);

        if (data.role === 'CARRIER') {
            const companyName = data.companyName || `${data.firstName || 'Carrier'} Transport`;
            await authRepository.createCarrier(companyName, user.id);
        }

        return this.generateToken(user);
    }

    async login(data: LoginDto) {
        console.log(`[AuthService] Login attempt for email: ${data.email}`);
        const user = await authRepository.findByEmail(data.email);

        if (!user) {
            console.log(`[AuthService] Login failed: User not found for email: ${data.email}`);
            throw new Error('Invalid credentials');
        }

        console.log(`[AuthService] User found: ${user.firstName} ${user.lastName}, Role: ${user.role}`);

        const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);
        console.log(`[AuthService] Password validation: ${isPasswordValid ? 'SUCCESS' : 'FAILED'}`);

        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        return this.generateToken(user);
    }

    async sendEmailOtp(email: string, name: string) {
        return otpService.sendEmailOtp(email, name);
    }

    async verifyEmailOtp(email: string, code: string) {
        return otpService.verifyOtp(email, code);
    }

    private generateToken(user: any) {
        const secret = env.JWT_SECRET;
        const payload = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
        };
        const token = jwt.sign(payload, secret, { expiresIn: '1d' });
        return { token, user: payload };
    }
}
