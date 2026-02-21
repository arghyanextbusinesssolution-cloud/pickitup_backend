"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWorker = exports.createQueue = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = __importDefault(require("./redis"));
const createQueue = (name) => {
    return new bullmq_1.Queue(name, { connection: redis_1.default });
};
exports.createQueue = createQueue;
const createWorker = (name, processor) => {
    return new bullmq_1.Worker(name, processor, { connection: redis_1.default });
};
exports.createWorker = createWorker;
