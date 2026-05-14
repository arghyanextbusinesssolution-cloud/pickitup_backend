import prisma from '../../config/db';
import { CreateShipmentDto, UpdateShipmentDto } from './shipment.types';

export class ShipmentRepository {
    async create(data: CreateShipmentDto, ownerId: string) {
        const { photoUrls, ...rest } = data;

        return prisma.shipment.create({
            data: {
                ...rest,
                ownerId,
                pickupDate: data.pickupDate ? new Date(data.pickupDate) : undefined,
                deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : undefined,
                images: photoUrls && photoUrls.length > 0 ? {
                    create: photoUrls.map(url => ({ imageUrl: url }))
                } : undefined
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

    async findAvailable(filters?: { startDate?: Date, endDate?: Date, minBids?: number, maxDistance?: number, lat?: number, lng?: number, radius?: number }) {
        let options: any = { status: 'OPEN' };

        if (filters) {
            if (filters.startDate || filters.endDate) {
                options.createdAt = {};
                if (filters.startDate) options.createdAt.gte = filters.startDate;
                if (filters.endDate) options.createdAt.lte = filters.endDate;
            }
            if (filters.maxDistance) {
                options.distanceKm = { lte: filters.maxDistance };
            }
        }

        let shipments = await prisma.shipment.findMany({
            where: options,
            include: {
                owner: { select: { firstName: true, lastName: true } },
                bids: true
            },
            orderBy: { createdAt: 'desc' }
        });

        if (filters?.minBids) {
            shipments = shipments.filter((s: any) => s.bids.length >= filters.minBids!);
        }

        if (filters?.lat && filters?.lng && filters?.radius) {
            shipments = shipments.filter((s: any) => {
                if (!s.originLatitude || !s.originLongitude) return false;
                const R = 6371;
                const dLat = (s.originLatitude - filters.lat!) * Math.PI / 180;
                const dLon = (s.originLongitude - filters.lng!) * Math.PI / 180;
                const a = 
                    Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(filters.lat! * Math.PI / 180) * Math.cos(s.originLatitude * Math.PI / 180) * 
                    Math.sin(dLon/2) * Math.sin(dLon/2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                const d = R * c;
                return d <= filters.radius!;
            });
        }

        return shipments;
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
                booking: {
                    include: {
                        claims: true
                    }
                }
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
                booking: {
                    include: {
                        claims: true
                    }
                },
                items: true,
                images: true,
                stops: true,
                documents: true
            }
        });
    }

    async update(id: string, data: UpdateShipmentDto) {
        const { photoUrls, ...rest } = data;
        const updateData: any = { ...rest };
        
        if (data.pickupDate) updateData.pickupDate = new Date(data.pickupDate);
        if (data.deliveryDate) updateData.deliveryDate = new Date(data.deliveryDate);

        if (photoUrls && photoUrls.length > 0) {
            updateData.images = {
                deleteMany: {},
                create: photoUrls.map(url => ({ imageUrl: url }))
            };
        }

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

