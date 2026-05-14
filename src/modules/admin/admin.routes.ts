import { Router } from 'express';
import { adminController } from './admin.controller';
import { authMiddleware, roleMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(['ADMIN']));

router.get('/stats', adminController.getStats);
router.get('/charts', adminController.getChartData);
router.get('/claims', adminController.getClaims);
router.patch('/claims/:id/status', adminController.updateClaimStatus);
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserDetails);
router.get('/carriers', adminController.getCarriers);
router.get('/carriers/:id', adminController.getCarrierDetails);
router.get('/transactions', adminController.getTransactions);
router.get('/shipments', adminController.getShipments);
router.get('/parcels/live', adminController.getLiveParcels);
router.delete('/wipe-database', adminController.wipeDatabase.bind(adminController));

export default router;
