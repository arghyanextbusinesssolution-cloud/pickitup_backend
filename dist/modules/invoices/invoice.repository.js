"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceRepository = exports.InvoiceRepository = void 0;
class InvoiceRepository {
    async createInvoice(data) {
        console.log('Creating invoice record', data);
        return { id: 'poly-inv-id', ...data };
    }
    async findByBookingId(bookingId) {
        return null;
    }
}
exports.InvoiceRepository = InvoiceRepository;
exports.invoiceRepository = new InvoiceRepository();
