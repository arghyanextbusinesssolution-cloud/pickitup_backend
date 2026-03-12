import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { InvoiceService } from './invoice.service';

const invoiceService = new InvoiceService();

export class InvoiceController {
    async generate(req: AuthRequest, res: Response) {
        try {
            const { bookingId } = req.body;
            const result = await invoiceService.generateInvoice(bookingId);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}

export const invoiceController = new InvoiceController();
