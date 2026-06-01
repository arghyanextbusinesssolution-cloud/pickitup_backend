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

    async findAvailable(filters?: {
        startDate?: Date,
        endDate?: Date,
        minBids?: number,
        maxDistance?: number,
        lat?: number,
        lng?: number,
        radius?: number,
        minWeight?: number,
        maxWeight?: number,
        weightUnit?: string,
        minBudget?: number,
        maxBudget?: number,
        category?: string,
        subcategory?: string
    }) {
        let options: any = { status: 'OPEN' };

        if (filters) {
            // Date Filters
            if (filters.startDate || filters.endDate) {
                options.createdAt = {};
                if (filters.startDate) options.createdAt.gte = filters.startDate;
                if (filters.endDate) options.createdAt.lte = filters.endDate;
            }

            // Distance Filter (using the field in Miles)
            if (filters.maxDistance) {
                options.distanceMiles = { lte: filters.maxDistance };
            }

            // Weight Filters
            if (filters.minWeight || filters.maxWeight) {
                options.weight = {};
                if (filters.minWeight) options.weight.gte = filters.minWeight;
                if (filters.maxWeight) options.weight.lte = filters.maxWeight;
            }
            if (filters.weightUnit) {
                options.weightUnit = filters.weightUnit;
            }

            // Budget Filters
            if (filters.minBudget || filters.maxBudget) {
                options.budgetMax = {}; // Usually carriers filter by what the shipper is willing to pay
                if (filters.minBudget) options.budgetMax.gte = filters.minBudget;
                if (filters.maxBudget) options.budgetMax.lte = filters.maxBudget;
            }

            // Category Filters
            if (filters.category) {
                options.category = filters.category;
            }
            if (filters.subcategory) {
                options.subcategory = filters.subcategory;
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

        // Min Bids Filter (Post-processing)
        if (filters?.minBids) {
            shipments = shipments.filter((s: any) => s.bids.length >= filters.minBids!);
        }

        // Geospatial/Radius Filter (Post-processing using Miles)
        if (filters?.lat && filters?.lng && filters?.radius) {
            shipments = shipments.filter((s: any) => {
                if (!s.originLatitude || !s.originLongitude) return false;
                const R = 3958.8; // Miles
                const dLat = (s.originLatitude - filters.lat!) * Math.PI / 180;
                const dLon = (s.originLongitude - filters.lng!) * Math.PI / 180;
                const a =
                    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(filters.lat! * Math.PI / 180) * Math.cos(s.originLatitude * Math.PI / 180) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
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

