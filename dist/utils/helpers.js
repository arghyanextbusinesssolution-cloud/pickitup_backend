"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = exports.generateRandomId = exports.formatDate = void 0;
const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US').format(date);
};
exports.formatDate = formatDate;
const generateRandomId = (length = 8) => {
    return Math.random().toString(36).substring(2, 2 + length);
};
exports.generateRandomId = generateRandomId;
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
exports.sleep = sleep;
