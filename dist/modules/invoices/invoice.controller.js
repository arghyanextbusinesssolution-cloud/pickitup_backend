"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceController = exports.InvoiceController = void 0;
const invoice_service_1 = require("./invoice.service");
const invoiceService = new invoice_service_1.InvoiceService();
class InvoiceController {
    async generate(req, res) {
        try {
            const { bookingId } = req.body;
            const result = await invoiceService.generateInvoice(bookingId);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.InvoiceController = InvoiceController;
exports.invoiceController = new InvoiceController();
