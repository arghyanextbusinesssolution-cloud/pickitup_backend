import prisma from '../../config/db';
import { RegisterDto } from './auth.types';

export class AuthRepository {
    async findByEmail(email: string) {
        return prisma.user.findUnique({ where: { email } });
    }

    async createUser(data: RegisterDto, hashedPassword: string) {
        return prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                firstName: data.firstName,
                lastName: data.lastName,
                role: data.role
            }
        });
    }

    async createCarrier(companyName: string, userId: string) {
        return prisma.carrier.create({
            data: {
                companyName,
                userId
            }
        });
    }
}

export const authRepository = new AuthRepository();
