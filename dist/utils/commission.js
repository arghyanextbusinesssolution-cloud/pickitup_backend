"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNetAmount = exports.calculateCommission = void 0;
const calculateCommission = (amount, percentage = 0.1) => {
    return Number((amount * percentage).toFixed(2));
};
exports.calculateCommission = calculateCommission;
const getNetAmount = (amount, commission) => {
    return Number((amount - commission).toFixed(2));
};
exports.getNetAmount = getNetAmount;
