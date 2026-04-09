"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRepository = exports.PaymentRepository = void 0;
const client_1 = require("@prisma/client");
const db_1 = __importDefault(require("../../config/db"));
class PaymentRepository {
    async create(data) {
        return db_1.default.payment.create({
            data: {
                bookingId: data.bookingId,
                payerId: data.payerId,
                amount: new client_1.Prisma.Decimal(data.amount),
                currency: data.currency || 'USD',
                method: data.method,
                gatewayPaymentId: data.gatewayPaymentId,
                status: client_1.PaymentStatus.PENDING,
            }
        });
    }
    async updateStatus(id, status, gatewayPaymentId) {
        return db_1.default.payment.update({
            where: { id },
            data: {
                status,
                gatewayPaymentId: gatewayPaymentId || undefined
            }
        });
    }
    async findByGatewayId(gatewayPaymentId) {
        return db_1.default.payment.findFirst({
            where: { gatewayPaymentId }
        });
    }
}
exports.PaymentRepository = PaymentRepository;
exports.paymentRepository = new PaymentRepository();
