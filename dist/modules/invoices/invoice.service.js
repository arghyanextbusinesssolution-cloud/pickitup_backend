"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceService = void 0;
const invoice_repository_1 = require("./invoice.repository");
class InvoiceService {
    async generateInvoice(bookingId) {
        // Business logic to generate PDF/JSON
        console.log('Generating invoice for booking', bookingId);
        return invoice_repository_1.invoiceRepository.createInvoice({ bookingId, invoiceNumber: `INV-${Date.now()}` });
    }
}
exports.InvoiceService = InvoiceService;
