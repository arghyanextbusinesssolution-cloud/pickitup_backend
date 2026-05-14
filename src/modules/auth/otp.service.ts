import axios from 'axios';
import prisma from '../../config/db';
import { env } from '../../config/env';

export class OtpService {
    private readonly serviceId  = env.EMAILJS_SERVICE_ID;
    private readonly templateId = env.EMAILJS_TEMPLATE_ID;
    private readonly publicKey  = env.EMAILJS_PUBLIC_KEY;
    private readonly privateKey = env.EMAILJS_PRIVATE_KEY;

    async sendEmailOtp(email: string, name: string) {
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiryMinutes = 10;
        const expiresAt = new Date(Date.now() + expiryMinutes * 60000);

        console.log(`[OtpService] Generating OTP for ${email}: ${otpCode}`);

        // Store OTP in DB
        await prisma.otp.create({
            data: {
                email,
                code: otpCode,
                expiresAt,
            }
        });

        // Send via EmailJS REST API
        try {
            const payload = {
                service_id: this.serviceId,
                template_id: this.templateId,
                user_id: this.publicKey,
                accessToken: this.privateKey,
                template_params: {
                    name,
                    app_name: 'uShip',
                    otp_code: otpCode,
                    expiry_minutes: expiryMinutes.toString(),
                    support_email: 'support@uship.com',
                    to_email: email,
                    email: email
                }
            };

            console.log('[OtpService] Dispatching EmailJS payload:', JSON.stringify(payload, null, 2));

            const response = await axios.post('https://api.emailjs.com/api/v1.0/email/send', payload);
            console.log('[OtpService] EmailJS response:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('Error sending email OTP:', error.response?.data || error.message);
            throw new Error('Failed to send verification email');
        }
    }

    async verifyOtp(email: string, code: string) {
        const otpRecord = await prisma.otp.findFirst({
            where: {
                email,
                code,
                expiresAt: { gt: new Date() }
            },
            orderBy: { createdAt: 'desc' }
        });

        if (!otpRecord) {
            console.warn(`[OtpService] Invalid or expired OTP attempt for ${email}`);
            throw new Error('Invalid or expired OTP');
        }

        console.log(`[OtpService] OTP verified for ${email}`);

        // Delete OTP after successful verification
        await prisma.otp.delete({ where: { id: otpRecord.id } });

        return true;
    }
}

export const otpService = new OtpService();
