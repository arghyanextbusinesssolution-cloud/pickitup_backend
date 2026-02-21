"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const logger_1 = require("../utils/logger");
const errorMiddleware = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    logger_1.logger.error(`${req.method} ${req.url} - ${status} - ${message}`);
    if (err.stack) {
        logger_1.logger.debug(err.stack);
    }
    res.status(status).json({
        error: {
            message,
            status,
            timestamp: new Date().toISOString(),
        },
    });
};
exports.errorMiddleware = errorMiddleware;
