import { invoiceRepository } from './invoice.repository';

export class InvoiceService {
    async generateInvoice(bookingId: string) {
        // Business logic to generate PDF/JSON
        console.log('Generating invoice for booking', bookingId);
        return invoiceRepository.createInvoice({ bookingId, invoiceNumber: `INV-${Date.now()}` });
    }
}
