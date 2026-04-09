"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipmentService = void 0;
const shipment_repository_1 = require("./shipment.repository");
const db_1 = __importDefault(require("../../config/db"));
class ShipmentService {
    async create(data, ownerId) {
        return shipment_repository_1.shipmentRepository.create(data, ownerId);
    }
    async findAll() {
        return shipment_repository_1.shipmentRepository.findAll();
    }
    async findByOwner(ownerId) {
        return shipment_repository_1.shipmentRepository.findByOwnerId(ownerId);
    }
    async findAvailable() {
        return shipment_repository_1.shipmentRepository.findAvailable();
    }
    async findCarrierJobs(userId) {
        return shipment_repository_1.shipmentRepository.findCarrierShipments(userId);
    }
    async findOne(id) {
        return shipment_repository_1.shipmentRepository.findById(id);
    }
    async update(id, data, userId) {
        const shipment = await shipment_repository_1.shipmentRepository.findById(id);
        if (!shipment)
            throw new Error('Shipment not found');
        const isOwner = shipment.ownerId === userId;
        if (!isOwner) {
            // Check if the requester is the assigned carrier for this shipment
            const carrier = await db_1.default.carrier.findUnique({ where: { userId } });
            const booking = await db_1.default.booking.findFirst({
                where: { shipmentId: id, carrierId: carrier?.id ?? '' }
            });
            if (!booking) {
                throw new Error('FORBIDDEN: You are not authorized to update this shipment');
            }
            // Carriers can only update the status field, nothing else
            const allowedCarrierData = {};
            if (data.status)
                allowedCarrierData.status = data.status;
            return shipment_repository_1.shipmentRepository.update(id, allowedCarrierData);
        }
        return shipment_repository_1.shipmentRepository.update(id, data);
    }
    async delete(id, ownerId) {
        const shipment = await shipment_repository_1.shipmentRepository.findById(id);
        if (!shipment || shipment.ownerId !== ownerId) {
            throw new Error('Unauthorized or shipment not found');
        }
        return shipment_repository_1.shipmentRepository.delete(id);
    }
}
exports.ShipmentService = ShipmentService;
