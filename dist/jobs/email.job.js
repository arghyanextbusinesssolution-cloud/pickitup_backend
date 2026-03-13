"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailWorker = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
exports.emailWorker = new bullmq_1.Worker('emailQueue', async (job) => {
    console.log(`Sending email to ${job.data.to} with subject ${job.data.subject}`);
    // Implement actual email sending logic here (e.g. NodeMailer, SES)
}, { connection: redis_1.redisConnection });
