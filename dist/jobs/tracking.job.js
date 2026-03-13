"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackingWorker = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
exports.trackingWorker = new bullmq_1.Worker('trackingQueue', async (job) => {
    console.log(`Updating tracking for shipment ${job.data.shipmentId}`);
    // Implement external tracking API integration here
}, { connection: redis_1.redisConnection });
