import { Router } from 'express';
import { bidController } from './bid.controller';
import { authMiddleware, roleMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', roleMiddleware(['CARRIER']), bidController.create);
router.post('/:bidId/accept', roleMiddleware(['SHIPPER']), bidController.acceptBid);
router.get('/shipment/:shipmentId', bidController.getShipmentBids);
router.get('/my', roleMiddleware(['CARRIER']), bidController.getMyBids);
router.get('/:bidId', bidController.getById);

export default router;
