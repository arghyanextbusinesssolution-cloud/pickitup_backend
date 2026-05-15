"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRepository = exports.AdminRepository = void 0;
const db_1 = __importDefault(require("../../config/db"));
class AdminRepository {
    async getAnalytics() {
        const userCount = await db_1.default.user.count({ where: { role: 'SHIPPER' } });
        const carrierCount = await db_1.default.carrier.count();
        const activeShipmentCount = await db_1.default.shipment.count({
            where: {
                status: { in: ['ASSIGNED', 'IN_TRANSIT'] }
            }
        });
        // Sum of all paid payments as Gross Revenue
        const grossRevenue = await db_1.default.payment.aggregate({
            where: { status: 'PAID' },
            _sum: { amount: true }
        });
        const payoutSum = grossRevenue._sum.amount || 0;
        return {
            userCount,
            carrierCount,
            activeShipmentCount,
            payoutSum: Number(payoutSum),
            shipmentCount: await db_1.default.shipment.count(),
            bookingCount: await db_1.default.booking.count()
        };
    }
    async getChartData() {
        // Fetch last 6 months of shipments for the trend graph
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const shipments = await db_1.default.shipment.findMany({
            where: { createdAt: { gte: sixMonthsAgo } },
            select: { createdAt: true }
        });
        const payments = await db_1.default.payment.findMany({
            where: { createdAt: { gte: sixMonthsAgo }, status: 'PAID' },
            select: { createdAt: true, amount: true }
        });
        // Group by month
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonth = new Date().getMonth();
        const last6Months = [];
        for (let i = 5; i >= 0; i--) {
            const m = (currentMonth - i + 12) % 12;
            const monthName = months[m];
            const year = new Date().getFullYear() - (currentMonth - i < 0 ? 1 : 0);
            const monthShipments = shipments.filter(s => {
                const d = new Date(s.createdAt);
                return d.getMonth() === m && d.getFullYear() === year;
            });
            const monthRevenue = payments.filter(p => {
                const d = new Date(p.createdAt);
                return d.getMonth() === m && d.getFullYear() === year;
            }).reduce((sum, p) => sum + Number(p.amount), 0);
            last6Months.push({
                name: monthName,
                volume: monthShipments.length,
                revenue: monthRevenue
            });
        }
        return last6Months;
    }
    async getClaims() {
        return db_1.default.claim.findMany({
            include: {
                attachments: true,
                messages: true,
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
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async updateClaimStatus(id, status) {
        return db_1.default.claim.update({
            where: { id },
            data: { status: status },
            include: {
                booking: {
                    include: {
                        shipment: true
                    }
                }
            }
        });
    }
    async getUsersWithMetrics() {
        const users = await db_1.default.user.findMany({
            where: { role: 'SHIPPER', deletedAt: null },
            include: {
                shipments: {
                    select: { id: true }
                },
                paymentsMade: {
                    where: { status: 'PAID' },
                    select: { amount: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return users.map(user => ({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            totalOrders: user.shipments.length,
            ltv: user.paymentsMade.reduce((sum, p) => sum + Number(p.amount), 0),
            createdAt: user.createdAt,
            isVerified: user.isVerified
        }));
    }
    async getUserByIdWithMetrics(id) {
        const user = await db_1.default.user.findUnique({
            where: { id, deletedAt: null },
            include: {
                shipments: {
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                    include: {
                        booking: {
                            include: {
                                tracking: { orderBy: { createdAt: 'desc' }, take: 1 }
                            }
                        }
                    }
                },
                paymentsMade: {
                    where: { status: 'PAID' },
                    select: { amount: true, createdAt: true }
                }
            }
        });
        if (!user)
            return null;
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            totalOrders: user.shipments.length,
            ltv: user.paymentsMade.reduce((sum, p) => sum + Number(p.amount), 0),
            createdAt: user.createdAt,
            isVerified: user.isVerified,
            recentShipments: user.shipments.map(s => ({
                id: s.id,
                title: s.title,
                status: s.status,
                origin: s.originAddress,
                destination: s.destinationAddress,
                date: s.createdAt,
                currentLocation: s.booking?.tracking?.[0]?.notes || 'Awaiting update'
            })),
            paymentHistory: user.paymentsMade
        };
    }
    async getCarrierByIdWithMetrics(id) {
        const carrier = await db_1.default.carrier.findUnique({
            where: { id, deletedAt: null },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true,
                        createdAt: true
                    }
                },
                vehicles: true,
                bookings: {
                    include: {
                        shipment: true,
                        tracking: { orderBy: { createdAt: 'desc' }, take: 1 }
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 10
                }
            }
        });
        if (!carrier)
            return null;
        return {
            id: carrier.id,
            companyName: carrier.companyName,
            firstName: carrier.user.firstName,
            lastName: carrier.user.lastName,
            email: carrier.user.email,
            phone: carrier.user.phone,
            rating: Number(carrier.rating),
            isVerified: carrier.isVerified,
            createdAt: carrier.user.createdAt,
            vehicleCount: carrier.vehicles.length,
            vehicles: carrier.vehicles,
            totalEarnings: carrier.bookings.reduce((sum, b) => sum + Number(b.price), 0),
            completedShipments: carrier.bookings.filter(b => b.status === 'COMPLETED').length,
            recentShipments: carrier.bookings.map(b => ({
                id: b.shipment.id,
                title: b.shipment.title,
                status: b.status,
                origin: b.shipment.originAddress,
                destination: b.shipment.destinationAddress,
                date: b.createdAt,
                currentLocation: b.tracking?.[0]?.notes || 'Awaiting update'
            }))
        };
    }
    async getCarriersWithMetrics() {
        const carriers = await db_1.default.carrier.findMany({
            where: { deletedAt: null },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true,
                        createdAt: true
                    }
                },
                vehicles: {
                    select: { vehicleType: true }
                },
                bookings: {
                    where: { status: 'COMPLETED' },
                    select: { price: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return carriers.map(carrier => ({
            id: carrier.id,
            companyName: carrier.companyName,
            firstName: carrier.user.firstName,
            lastName: carrier.user.lastName,
            email: carrier.user.email,
            phone: carrier.user.phone,
            rating: Number(carrier.rating),
            isVerified: carrier.isVerified,
            createdAt: carrier.user.createdAt,
            vehicleCount: carrier.vehicles.length,
            mainVehicle: carrier.vehicles[0]?.vehicleType || 'None',
            totalEarnings: carrier.bookings.reduce((sum, b) => sum + Number(b.price), 0),
            completedShipments: carrier.bookings.length
        }));
    }
    async getTransactionsWithMetrics() {
        const payments = await db_1.default.payment.findMany({
            where: { deletedAt: null },
            include: {
                payer: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                },
                booking: {
                    include: {
                        shipment: {
                            select: { title: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return payments.map(payment => ({
            id: payment.id,
            amount: Number(payment.amount),
            currency: payment.currency,
            status: payment.status,
            method: payment.method,
            payerName: `${payment.payer.firstName} ${payment.payer.lastName}`,
            payerEmail: payment.payer.email,
            shipmentTitle: payment.booking.shipment.title,
            createdAt: payment.createdAt,
            gatewayPaymentId: payment.gatewayPaymentId
        }));
    }
    async getShipmentsWithTracking() {
        const shipments = await db_1.default.shipment.findMany({
            where: { deletedAt: null },
            include: {
                owner: {
                    select: { firstName: true, lastName: true, email: true }
                },
                booking: {
                    include: {
                        carrier: {
                            include: {
                                user: {
                                    select: { firstName: true, lastName: true }
                                }
                            }
                        },
                        tracking: {
                            orderBy: { createdAt: 'desc' },
                            take: 1
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return shipments.map(s => ({
            id: s.id,
            title: s.title,
            status: s.status,
            origin: s.originAddress,
            destination: s.destinationAddress,
            ownerName: `${s.owner.firstName} ${s.owner.lastName}`,
            ownerEmail: s.owner.email,
            carrierName: s.booking?.carrier ? `${s.booking.carrier.user.firstName} ${s.booking.carrier.user.lastName}` : 'Unassigned',
            currentLocation: s.booking?.tracking?.[0]?.notes || 'Awaiting update',
            lastUpdated: s.booking?.tracking?.[0]?.createdAt || s.createdAt,
            distance: s.distanceKm,
            price: Number(s.finalPrice || s.budgetMax || 0)
        }));
    }
    async getLiveParcels() {
        const shipments = await db_1.default.shipment.findMany({
            where: {
                status: {
                    in: ['IN_TRANSIT', 'ASSIGNED']
                },
                deletedAt: null
            },
            take: 20,
            include: {
                owner: true
            }
        });
        if (shipments.length === 0)
            return null;
        const shipment = shipments[Math.floor(Math.random() * shipments.length)];
        const cityToHub = {
            'New York': 'NYC', 'Los Angeles': 'LAX', 'Chicago': 'CHI',
            'London': 'LDN', 'Amsterdam': 'AMS', 'Frankfurt': 'FRA',
            'Paris': 'CDG', 'Madrid': 'MAD', 'Dubai': 'DXB',
            'Mumbai': 'BOM', 'Delhi': 'DEL', 'Singapore': 'SIN',
            'Hong Kong': 'HKG', 'Shanghai': 'SHA', 'Tokyo': 'TKY',
            'Sydney': 'SYD', 'Johannesburg': 'JNB', 'São Paulo': 'SAO',
            'Mexico City': 'MEX'
        };
        const getHub = (address) => {
            if (!address)
                return 'LDN';
            for (const city in cityToHub) {
                if (address.toLowerCase().includes(city.toLowerCase()))
                    return cityToHub[city];
            }
            const hubs = Object.values(cityToHub);
            return hubs[Math.floor(Math.random() * hubs.length)];
        };
        const from_hub = getHub(shipment.originAddress);
        let to_hub = getHub(shipment.destinationAddress);
        if (to_hub === from_hub) {
            const hubs = Object.values(cityToHub);
            to_hub = hubs.find(h => h !== from_hub) || 'LDN';
        }
        return {
            from_hub,
            to_hub,
            parcel_id: `PX-${shipment.id.slice(-6).toUpperCase()}`,
            type: shipment.category || 'Express',
            weight: `${shipment.weight || '25'} kg`,
            status: shipment.status.replace('_', ' ')
        };
    }
}
exports.AdminRepository = AdminRepository;
exports.adminRepository = new AdminRepository();
