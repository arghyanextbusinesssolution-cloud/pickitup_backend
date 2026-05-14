"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shipmentRepository = exports.ShipmentRepository = void 0;
const db_1 = __importDefault(require("../../config/db"));
class ShipmentRepository {
    async create(data, ownerId) {
        return db_1.default.shipment.create({
            data: {
                ...data,
                ownerId,
                pickupDate: data.pickupDate ? new Date(data.pickupDate) : undefined,
                deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : undefined,
            }
        });
    }
    async findAll() {
        return db_1.default.shipment.findMany({
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
    async findByOwnerId(ownerId) {
        return db_1.default.shipment.findMany({
            where: { ownerId },
            include: {
                bids: true,
                booking: true
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async findAvailable(filters) {
        let options = { status: 'OPEN' };
        if (filters) {
            if (filters.startDate || filters.endDate) {
                options.createdAt = {};
                if (filters.startDate)
                    options.createdAt.gte = filters.startDate;
                if (filters.endDate)
                    options.createdAt.lte = filters.endDate;
            }
            if (filters.maxDistance) {
                options.distanceKm = { lte: filters.maxDistance };
            }
        }
        let shipments = await db_1.default.shipment.findMany({
            where: options,
            include: {
                owner: { select: { firstName: true, lastName: true } },
                bids: true
            },
            orderBy: { createdAt: 'desc' }
        });
        if (filters?.minBids) {
            shipments = shipments.filter((s) => s.bids.length >= filters.minBids);
        }
        if (filters?.lat && filters?.lng && filters?.radius) {
            shipments = shipments.filter((s) => {
                if (!s.originLatitude || !s.originLongitude)
                    return false;
                const R = 6371;
                const dLat = (s.originLatitude - filters.lat) * Math.PI / 180;
                const dLon = (s.originLongitude - filters.lng) * Math.PI / 180;
                const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(filters.lat * Math.PI / 180) * Math.cos(s.originLatitude * Math.PI / 180) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                const d = R * c;
                return d <= filters.radius;
            });
        }
        return shipments;
    }
    async findCarrierShipments(userId) {
        return db_1.default.shipment.findMany({
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
    async findById(id) {
        return db_1.default.shipment.findUnique({
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
    async update(id, data) {
        const updateData = { ...data };
        if (data.pickupDate)
            updateData.pickupDate = new Date(data.pickupDate);
        if (data.deliveryDate)
            updateData.deliveryDate = new Date(data.deliveryDate);
        return db_1.default.shipment.update({
            where: { id },
            data: updateData
        });
    }
    async delete(id) {
        // Use soft delete by default for production hardening
        return db_1.default.shipment.update({
            where: { id },
            data: { deletedAt: new Date() }
        });
    }
}
exports.ShipmentRepository = ShipmentRepository;
exports.shipmentRepository = new ShipmentRepository();
