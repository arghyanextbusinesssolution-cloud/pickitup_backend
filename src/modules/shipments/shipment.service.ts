import { shipmentRepository } from './shipment.repository';
import { CreateShipmentDto, UpdateShipmentDto } from './shipment.types';

export class ShipmentService {
    async create(data: CreateShipmentDto, ownerId: string) {
        return shipmentRepository.create(data, ownerId);
    }

    async findAll() {
        return shipmentRepository.findAll();
    }

    async findByOwner(ownerId: string) {
        return shipmentRepository.findByOwnerId(ownerId);
    }

    async findAvailable() {
        return shipmentRepository.findAvailable();
    }

    async findCarrierJobs(userId: string) {
        return shipmentRepository.findCarrierShipments(userId);
    }

    async findOne(id: string) {
        return shipmentRepository.findById(id);
    }

    async update(id: string, data: UpdateShipmentDto, ownerId: string) {
        const shipment = await shipmentRepository.findById(id);
        if (!shipment || shipment.ownerId !== ownerId) {
            throw new Error('Unauthorized or shipment not found');
        }
        return shipmentRepository.update(id, data);
    }

    async delete(id: string, ownerId: string) {
        const shipment = await shipmentRepository.findById(id);
        if (!shipment || shipment.ownerId !== ownerId) {
            throw new Error('Unauthorized or shipment not found');
        }
        return shipmentRepository.delete(id);
    }
}
