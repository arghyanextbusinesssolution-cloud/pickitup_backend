import { Request, Response } from 'express';
import { enquiryService } from './enquiry.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

export class EnquiryController {
    // Public: anyone can submit a contact form
    async submit(req: Request, res: Response) {
        try {
            const { name, email, inquiryType, message } = req.body;
            const enquiry = await enquiryService.submitEnquiry({
                name,
                email,
                inquiryType: inquiryType || 'General Support',
                message
            });
            res.status(201).json({ success: true, data: enquiry });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    // Admin only: list all enquiries
    async getAll(req: AuthRequest, res: Response) {
        try {
            const enquiries = await enquiryService.getAllEnquiries();
            res.status(200).json(enquiries);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    // Admin only: get single enquiry
    async getOne(req: AuthRequest, res: Response) {
        try {
            const id = req.params.id as string;
            const enquiry = await enquiryService.getEnquiryById(id);
            res.status(200).json(enquiry);
        } catch (error: any) {
            res.status(404).json({ error: error.message });
        }
    }

    // Admin only: update enquiry status
    async updateStatus(req: AuthRequest, res: Response) {
        try {
            const id = req.params.id as string;
            const { status } = req.body;
            const enquiry = await enquiryService.updateStatus(id, status);
            res.status(200).json(enquiry);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    // Admin only: count new enquiries
    async countNew(req: AuthRequest, res: Response) {
        try {
            const count = await enquiryService.getNewCount();
            res.status(200).json({ count });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

export const enquiryController = new EnquiryController();
