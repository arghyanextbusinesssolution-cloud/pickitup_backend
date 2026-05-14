import prisma from '../../config/db';

export class ClaimRepository {
    async create(data: { bookingId: string; reason: string; raisedById: string; photos?: string[] }) {
        const { photos, ...rest } = data;
        
        return prisma.claim.create({
            data: {
                ...rest,
                status: 'OPEN',
                attachments: {
                    create: (photos || []).map(url => ({
                        fileUrl: url,
                        fileName: 'Claim Evidence'
                    }))
                }
            },
            include: {
                attachments: true
            }
        });
    }

    async findMany() {
        return prisma.claim.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                booking: {
                    include: {
                        shipment: true
                    }
                },
                raisedBy: true
            }
        });
    }

    async findById(id: string) {
        return prisma.claim.findUnique({
            where: { id },
            include: {
                attachments: true,
                messages: {
                    include: { sender: true },
                    orderBy: { createdAt: 'asc' }
                },
                raisedBy: true,
                booking: {
                    include: {
                        shipment: {
                            include: {
                                owner: true
                            }
                        },
                        carrier: {
                            include: { user: true }
                        },
                        payments: true
                    }
                }
            }
        });
    }

    async findEligibleForClaim(userId: string) {
        // Find completed bookings with insurance that don't have an open claim
        return prisma.booking.findMany({
            where: {
                shipment: {
                    ownerId: userId,
                    status: 'DELIVERED'
                },
                status: 'COMPLETED',
                hasInsurance: true,
                claims: {
                    none: {
                        status: {
                            in: ['OPEN', 'UNDER_REVIEW']
                        }
                    }
                }
            },
            include: {
                shipment: true,
                carrier: true
            }
        });
    }

    async updateStatus(id: string, status: string) {
        return prisma.claim.update({
            where: { id },
            data: { status: status as any },
            include: {
                booking: {
                    include: {
                        shipment: true
                    }
                }
            }
        });
    }
}

export const claimRepository = new ClaimRepository();

