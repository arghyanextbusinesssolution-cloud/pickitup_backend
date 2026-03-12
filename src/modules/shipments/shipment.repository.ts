import prisma from '../../config/db';
import { CreateShipmentDto, UpdateShipmentDto } from './shipment.types';

export class ShipmentRepository {
    async create(data: CreateShipmentDto, ownerId: string) {
        return prisma.shipment.create({
            data: {
                ...data,
                ownerId
            }
        });
    }

    async findAll() {
        return prisma.shipment.findMany({
            include: {
                owner: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                },
                bids: true,
                booking: true
            }
        });
    }

    async findByOwnerId(ownerId: string) {
        return prisma.shipment.findMany({
            where: { ownerId },
            include: {
                bids: true,
                booking: true
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findAvailable() {
        return prisma.shipment.findMany({
            where: { status: 'PENDING' },
            include: {
                owner: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                },
                bids: true
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findCarrierShipments(userId: string) {
        return prisma.shipment.findMany({
            where: {
                booking: {
                    carrier: {
                        userId
                    }
                }
            },
            include: {
                owner: true,
                booking: true
            },
            orderBy: { updatedAt: 'desc' }
        });
    }

    async findById(id: string) {
        return prisma.shipment.findUnique({
            where: { id },
            include: {
                owner: true,
                bids: {
                    include: {
                        carrier: true
                    }
                }
            }
        });
    }

    async update(id: string, data: UpdateShipmentDto) {
        return prisma.shipment.update({
            where: { id },
            data
        });
    }

    async delete(id: string) {
        return prisma.shipment.delete({ where: { id } });
    }
}

export const shipmentRepository = new ShipmentRepository();
