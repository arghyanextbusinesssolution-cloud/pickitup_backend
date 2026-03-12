import { Worker, Job } from 'bullmq';
import { redisConnection } from '../config/redis';

export const invoiceWorker = new Worker('invoiceQueue', async (job: Job) => {
    console.log(`Processing invoice for booking ${job.data.bookingId}`);
    // Implement invoice generation and storage logic here
}, { connection: redisConnection as any });
