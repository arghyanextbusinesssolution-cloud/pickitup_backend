import { Worker, Job } from 'bullmq';
import { redisConnection } from '../config/redis';

export const emailWorker = new Worker('emailQueue', async (job: Job) => {
    console.log(`Sending email to ${job.data.to} with subject ${job.data.subject}`);
    // Implement actual email sending logic here (e.g. NodeMailer, SES)
}, { connection: redisConnection as any });
