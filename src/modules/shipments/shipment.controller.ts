import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { ShipmentService } from './shipment.service';
import { CreateShipmentSchema, UpdateShipmentSchema } from './shipment.types';

const shipmentService = new ShipmentService();

export class ShipmentController {
    async create(req: AuthRequest, res: Response) {
        try {
            console.log("[Shipment Controller] Validate creation for:", req.user!.email);
            
            // Validate input
            const validatedData = CreateShipmentSchema.parse(req.body);
            
            const result = await shipmentService.create(validatedData, req.user!.id);
            res.status(201).json(result);
        } catch (error: any) {
            console.error("[Shipment Controller] Validation/Creation failed:", error);
            if (error.errors) {
                return res.status(400).json({ error: 'Validation failed', details: error.errors });
            }
            res.status(400).json({ error: error.message });
        }
    }


    async getMyShipments(req: AuthRequest, res: Response) {
        try {
            const result = await shipmentService.findByOwner(req.user!.id);
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
            const result = await shipmentService.findCarrierJobs(req.user!.id);
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
            // Validate partially
            const validatedData = UpdateShipmentSchema.parse(req.body);

            const result = await shipmentService.update(req.params.id as string, validatedData, req.user!.id);
            res.status(200).json(result);
        } catch (error: any) {
            if (error.errors) {
                return res.status(400).json({ error: 'Validation failed', details: error.errors });
            }
            const isForbidden = error.message?.startsWith('FORBIDDEN');
            res.status(isForbidden ? 403 : 400).json({ error: error.message });
        }
    }


    async delete(req: AuthRequest, res: Response) {
        try {
            await shipmentService.delete(req.params.id as string, req.user!.id);
            res.status(204).send();
        } catch (error: any) {
            res.status(403).json({ error: error.message });
        }
    }
}

export const shipmentController = new ShipmentController();
