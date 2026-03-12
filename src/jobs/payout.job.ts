import { Worker, Job } from 'bullmq';
import { redisConnection } from '../config/redis';

export const payoutWorker = new Worker('payoutQueue', async (job: Job) => {
    console.log(`Processing payout for carrier ${job.data.carrierId}`);
    // Implement payout logic here
}, { connection: redisConnection as any });
