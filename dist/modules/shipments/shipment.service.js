"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipmentService = void 0;
const shipment_repository_1 = require("./shipment.repository");
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
    async update(id, data, ownerId) {
        const shipment = await shipment_repository_1.shipmentRepository.findById(id);
        if (!shipment || shipment.ownerId !== ownerId) {
            throw new Error('Unauthorized or shipment not found');
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
