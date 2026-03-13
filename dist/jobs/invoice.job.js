"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceWorker = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
exports.invoiceWorker = new bullmq_1.Worker('invoiceQueue', async (job) => {
    console.log(`Processing invoice for booking ${job.data.bookingId}`);
    // Implement invoice generation and storage logic here
}, { connection: redis_1.redisConnection });
