import { enquiryRepository } from './enquiry.repository';

export class EnquiryService {
    async submitEnquiry(data: {
        name: string;
        email: string;
        inquiryType: string;
        message: string;
    }) {
        if (!data.name || !data.email || !data.message) {
            throw new Error('Name, email, and message are required');
        }
        return enquiryRepository.create(data);
    }

    async getAllEnquiries() {
        return enquiryRepository.findAll();
    }

    async getEnquiryById(id: string) {
        const enquiry = await enquiryRepository.findById(id);
        if (!enquiry) throw new Error('Enquiry not found');
        return enquiry;
    }

    async updateStatus(id: string, status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED') {
        return enquiryRepository.updateStatus(id, status);
    }

    async getNewCount() {
        return enquiryRepository.countNew();
    }
}

export const enquiryService = new EnquiryService();
