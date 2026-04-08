import prisma from '../../config/db';
import { CreateShipmentDto, UpdateShipmentDto } from './shipment.types';

export class ShipmentRepository {
    async create(data: CreateShipmentDto, ownerId: string) {
        return prisma.shipment.create({
            data: {
                ...data,
                ownerId,
                pickupDate: data.pickupDate ? new Date(data.pickupDate) : undefined,
                deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : undefined,
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
            },
            orderBy: { createdAt: 'desc' }
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
            where: { status: 'OPEN' },
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
                },
                booking: true,
                items: true,
                images: true,
                stops: true,
                documents: true
            }
        });
    }

    async update(id: string, data: UpdateShipmentDto) {
        const updateData: any = { ...data };
        
        if (data.pickupDate) updateData.pickupDate = new Date(data.pickupDate);
        if (data.deliveryDate) updateData.deliveryDate = new Date(data.deliveryDate);

        return prisma.shipment.update({
            where: { id },
            data: updateData
        });
    }

    async delete(id: string) {
        // Use soft delete by default for production hardening
        return prisma.shipment.update({
            where: { id },
            data: { deletedAt: new Date() }
        });
    }
}

export const shipmentRepository = new ShipmentRepository();

