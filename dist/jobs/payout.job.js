"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payoutWorker = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
exports.payoutWorker = new bullmq_1.Worker('payoutQueue', async (job) => {
    console.log(`Processing payout for carrier ${job.data.carrierId}`);
    // Implement payout logic here
}, { connection: redis_1.redisConnection });
