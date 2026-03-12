import prisma from '../../config/db';

export class InvoiceRepository {
    async createInvoice(data: any) {
        console.log('Creating invoice record', data);
        return { id: 'poly-inv-id', ...data };
    }

    async findByBookingId(bookingId: string) {
        return null;
    }
}

export const invoiceRepository = new InvoiceRepository();
