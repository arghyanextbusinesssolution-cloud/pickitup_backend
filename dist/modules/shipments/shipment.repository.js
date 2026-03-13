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
                ownerId
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
            }
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
    async findAvailable() {
        return db_1.default.shipment.findMany({
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
                }
            }
        });
    }
    async update(id, data) {
        return db_1.default.shipment.update({
            where: { id },
            data
        });
    }
    async delete(id) {
        return db_1.default.shipment.delete({ where: { id } });
    }
}
exports.ShipmentRepository = ShipmentRepository;
exports.shipmentRepository = new ShipmentRepository();
