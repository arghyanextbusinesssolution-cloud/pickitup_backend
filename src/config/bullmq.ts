import { Queue, Worker, QueueEvents } from 'bullmq';
import redis from './redis';

export const createQueue = (name: string) => {
    return new Queue(name, { connection: redis as any });
};

export const createWorker = (name: string, processor: any) => {
    return new Worker(name, processor, { connection: redis as any });
};
