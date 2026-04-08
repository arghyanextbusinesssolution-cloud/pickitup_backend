import { bidRepository } from './bid.repository';
import { bookingRepository } from '../bookings/booking.repository';
import prisma from '../../config/db';

export class BidService {
    async placeBid(amount: number, deliveryEstimate: Date | undefined, shipmentId: string, carrierId: string) {
        const shipment = await prisma.shipment.findUnique({ where: { id: shipmentId } });
        if (!shipment || shipment.status !== 'OPEN') {
            throw new Error('Shipment not found or already booked');
        }

        return bidRepository.create({ amount, deliveryEstimate, shipmentId, carrierId });
    }

    async acceptBid(bidId: string, shipperId: string) {
        // Fetch the bid with shipment to validate ownership and status
        const bid = await prisma.bid.findUnique({
            where: { id: bidId },
            include: { shipment: true }
        });

        if (!bid) throw new Error('Bid not found');
        if (bid.shipment.ownerId !== shipperId) throw new Error('Not authorized to accept this bid');
        if (bid.shipment.status !== 'OPEN') throw new Error('Shipment is no longer open for bidding');

        // Atomically: create booking, accept bid, reject others, lock shipment
        const booking = await bookingRepository.create(
            bid.shipmentId,
            bid.carrierId,
            Number(bid.amount),
            bid.id
        );

        return booking;
    }

    async getShipmentBids(shipmentId: string) {
        return bidRepository.findManyByShipment(shipmentId);
    }

    async getCarrierBids(carrierId: string) {
        return bidRepository.findManyByCarrier(carrierId);
    }

    async getBidById(bidId: string) {
        return prisma.bid.findUnique({
            where: { id: bidId },
            include: {
                shipment: true,
                booking: {
                    include: {
                        payments: true
                    }
                }
            }
        });
    }
}
