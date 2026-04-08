import prisma from '../../config/db';
import { RegisterDto } from './auth.types';

export class AuthRepository {
    async findByEmail(email: string) {
        return prisma.user.findUnique({ where: { email } });
    }

    async createUser(data: RegisterDto, hashedPassword: string) {
        // Map 'USER' role to 'SHIPPER' to match Prisma enum
        const role = data.role === 'USER' ? 'SHIPPER' : data.role;
        
        return prisma.user.create({
            data: {
                email: data.email,
                passwordHash: hashedPassword,
                firstName: data.firstName,
                lastName: data.lastName,
                role: role as any // Still need to cast here as 'role' is a string but Prisma expects the Role enum
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
