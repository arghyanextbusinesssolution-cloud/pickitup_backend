import { Router } from 'express';
import { shipmentController } from './shipment.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', shipmentController.create);
router.get('/my', shipmentController.getMyShipments);
router.get('/available', shipmentController.getAvailableShipments);
router.get('/carrier', shipmentController.getCarrierJobs);
router.get('/', shipmentController.getAll);
router.get('/:id', shipmentController.getOne);
router.patch('/:id', shipmentController.update);
router.delete('/:id', shipmentController.delete);

export default router;
