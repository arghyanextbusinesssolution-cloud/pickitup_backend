import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { AdminService } from './admin.service';
import prisma from '../../config/db';

const adminService = new AdminService();

export class AdminController {
    async getStats(req: AuthRequest, res: Response) {
        try {
            const stats = await adminService.getPlatformStats();
            res.status(200).json(stats);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getChartData(req: AuthRequest, res: Response) {
        try {
            const chartData = await adminService.getChartData();
            res.status(200).json(chartData);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async verifyUser(req: AuthRequest, res: Response){
        try{

        }
        catch{
            
        }
    }

    async getClaims(req: AuthRequest, res: Response) {
        try {
            const claims = await adminService.getClaims();
            res.status(200).json(claims);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateClaimStatus(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const result = await adminService.updateClaimStatus(id as string, status as string);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async getUsers(req: AuthRequest, res: Response) {
        try {
            const users = await adminService.getUsers();
            console.log(`[AdminController] Fetched ${users.length} users`);
            res.status(200).json(users);
        } catch (error: any) {
            console.error('[AdminController] Error fetching users:', error.message);
            res.status(500).json({ error: error.message });
        }
    }

    async getUserDetails(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const user = await adminService.getUserById(id as string);
            if (!user) return res.status(404).json({ error: 'User not found' });
            res.status(200).json(user);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getCarriers(req: AuthRequest, res: Response) {
        try {
            const carriers = await adminService.getCarriers();
            console.log(`[AdminController] Fetched ${carriers.length} carriers`);
            if (carriers.length > 0) {
                console.log(`[AdminController] Sample carrier:`, JSON.stringify(carriers[0], null, 2));
            }
            res.status(200).json(carriers);
        } catch (error: any) {
            console.error('[AdminController] Error fetching carriers:', error.message);
            res.status(500).json({ error: error.message });
        }
    }

    async getCarrierDetails(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const carrier = await adminService.getCarrierById(id as string);
            if (!carrier) return res.status(404).json({ error: 'Carrier not found' });
            res.status(200).json(carrier);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getTransactions(req: AuthRequest, res: Response) {
        try {
            const transactions = await adminService.getTransactions();
            res.status(200).json(transactions);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getShipments(req: AuthRequest, res: Response) {
        try {
            const shipments = await adminService.getShipments();
            res.status(200).json(shipments);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getLiveParcels(req: AuthRequest, res: Response) {
        try {
            const parcel = await adminService.getLiveParcels();
            res.status(200).json(parcel);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async wipeDatabase(req: AuthRequest, res: Response) {
        const { confirmToken } = req.body;
        if (confirmToken !== 'WIPE_ALL_DATA_CONFIRMED') {
            return res.status(400).json({ error: 'Invalid confirmation token. Send confirmToken: WIPE_ALL_DATA_CONFIRMED' });
        }
        try {
            console.warn('[AdminController] ⚠️  DATABASE WIPE INITIATED by admin:', req.user?.email);
            const tablenames = await prisma.$queryRaw<{ tablename: string }[]>`
                SELECT tablename FROM pg_tables WHERE schemaname='public'
            `;
            const tables = tablenames
                .map(({ tablename }) => tablename)
                .filter((name) => name !== '_prisma_migrations')
                .map((name) => `"public"."${name}"`)
                .join(', ');

            if (tables) {
                await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} RESTART IDENTITY CASCADE;`);
                console.warn('[AdminController] ✅ Database wipe complete.');
                res.status(200).json({ message: 'All data wiped successfully. Database is clean.' });
            } else {
                res.status(200).json({ message: 'No tables found to wipe.' });
            }
        } catch (error: any) {
            console.error('[AdminController] ❌ Wipe failed:', error.message);
            res.status(500).json({ error: error.message });
        }
    }
}

export const adminController = new AdminController();
