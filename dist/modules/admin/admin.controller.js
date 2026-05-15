"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = exports.AdminController = void 0;
const admin_service_1 = require("./admin.service");
const db_1 = __importDefault(require("../../config/db"));
const adminService = new admin_service_1.AdminService();
class AdminController {
    async getStats(req, res) {
        try {
            const stats = await adminService.getPlatformStats();
            res.status(200).json(stats);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getChartData(req, res) {
        try {
            const chartData = await adminService.getChartData();
            res.status(200).json(chartData);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async verifyUser(req, res) {
        try {
        }
        catch {
        }
    }
    async getClaims(req, res) {
        try {
            const claims = await adminService.getClaims();
            res.status(200).json(claims);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async updateClaimStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const result = await adminService.updateClaimStatus(id, status);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async getUsers(req, res) {
        try {
            const users = await adminService.getUsers();
            console.log(`[AdminController] Fetched ${users.length} users`);
            res.status(200).json(users);
        }
        catch (error) {
            console.error('[AdminController] Error fetching users:', error.message);
            res.status(500).json({ error: error.message });
        }
    }
    async getUserDetails(req, res) {
        try {
            const { id } = req.params;
            const user = await adminService.getUserById(id);
            if (!user)
                return res.status(404).json({ error: 'User not found' });
            res.status(200).json(user);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getCarriers(req, res) {
        try {
            const carriers = await adminService.getCarriers();
            console.log(`[AdminController] Fetched ${carriers.length} carriers`);
            if (carriers.length > 0) {
                console.log(`[AdminController] Sample carrier:`, JSON.stringify(carriers[0], null, 2));
            }
            res.status(200).json(carriers);
        }
        catch (error) {
            console.error('[AdminController] Error fetching carriers:', error.message);
            res.status(500).json({ error: error.message });
        }
    }
    async getCarrierDetails(req, res) {
        try {
            const { id } = req.params;
            const carrier = await adminService.getCarrierById(id);
            if (!carrier)
                return res.status(404).json({ error: 'Carrier not found' });
            res.status(200).json(carrier);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getTransactions(req, res) {
        try {
            const transactions = await adminService.getTransactions();
            res.status(200).json(transactions);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getShipments(req, res) {
        try {
            const shipments = await adminService.getShipments();
            res.status(200).json(shipments);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getLiveParcels(req, res) {
        try {
            const parcel = await adminService.getLiveParcels();
            res.status(200).json(parcel);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async wipeDatabase(req, res) {
        const { confirmToken } = req.body;
        if (confirmToken !== 'WIPE_ALL_DATA_CONFIRMED') {
            return res.status(400).json({ error: 'Invalid confirmation token. Send confirmToken: WIPE_ALL_DATA_CONFIRMED' });
        }
        try {
            console.warn('[AdminController] ⚠️  DATABASE WIPE INITIATED by admin:', req.user?.email);
            const tablenames = await db_1.default.$queryRaw `
                SELECT tablename FROM pg_tables WHERE schemaname='public'
            `;
            const tables = tablenames
                .map(({ tablename }) => tablename)
                .filter((name) => name !== '_prisma_migrations')
                .map((name) => `"public"."${name}"`)
                .join(', ');
            if (tables) {
                await db_1.default.$executeRawUnsafe(`TRUNCATE TABLE ${tables} RESTART IDENTITY CASCADE;`);
                console.warn('[AdminController] ✅ Database wipe complete.');
                res.status(200).json({ message: 'All data wiped successfully. Database is clean.' });
            }
            else {
                res.status(200).json({ message: 'No tables found to wipe.' });
            }
        }
        catch (error) {
            console.error('[AdminController] ❌ Wipe failed:', error.message);
            res.status(500).json({ error: error.message });
        }
    }
}
exports.AdminController = AdminController;
exports.adminController = new AdminController();
