import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { ShipmentService } from './shipment.service';

const shipmentService = new ShipmentService();

export class ShipmentController {
    async create(req: AuthRequest, res: Response) {
        try {
            const result = await shipmentService.create(req.body, req.user!.userId);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async getMyShipments(req: AuthRequest, res: Response) {
        try {
            const result = await shipmentService.findByOwner(req.user!.userId);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAvailableShipments(req: AuthRequest, res: Response) {
        try {
            const result = await shipmentService.findAvailable();
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getCarrierJobs(req: AuthRequest, res: Response) {
        try {
            const result = await shipmentService.findCarrierJobs(req.user!.userId);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAll(req: AuthRequest, res: Response) {
        try {
            const result = await shipmentService.findAll();
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getOne(req: AuthRequest, res: Response) {
        try {
            const result = await shipmentService.findOne(req.params.id as string);
            if (!result) return res.status(404).json({ error: 'Shipment not found' });
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async update(req: AuthRequest, res: Response) {
        try {
            const result = await shipmentService.update(req.params.id as string, req.body, req.user!.userId);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(401).json({ error: error.message });
        }
    }

    async delete(req: AuthRequest, res: Response) {
        try {
            await shipmentService.delete(req.params.id as string, req.user!.userId);
            res.status(204).send();
        } catch (error: any) {
            res.status(401).json({ error: error.message });
        }
    }
}

export const shipmentController = new ShipmentController();
