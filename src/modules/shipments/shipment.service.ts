import { shipmentRepository } from './shipment.repository';
import { CreateShipmentDto, UpdateShipmentDto } from './shipment.types';
import prisma from '../../config/db';

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

    async update(id: string, data: UpdateShipmentDto, userId: string) {
        const shipment = await shipmentRepository.findById(id);
        if (!shipment) throw new Error('Shipment not found');

        const isOwner = shipment.ownerId === userId;

        if (!isOwner) {
            // Check if the requester is the assigned carrier for this shipment
            const carrier = await prisma.carrier.findUnique({ where: { userId } });
            const booking = await prisma.booking.findFirst({
                where: { shipmentId: id, carrierId: carrier?.id ?? '' }
            });
            if (!booking) {
                throw new Error('FORBIDDEN: You are not authorized to update this shipment');
            }
            // Carriers can only update the status field, nothing else
            const allowedCarrierData: UpdateShipmentDto = {};
            if (data.status) allowedCarrierData.status = data.status;
            return shipmentRepository.update(id, allowedCarrierData);
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
