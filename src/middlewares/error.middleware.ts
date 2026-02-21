import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    logger.error(`${req.method} ${req.url} - ${status} - ${message}`);

    if (err.stack) {
        logger.debug(err.stack);
    }

    res.status(status).json({
        error: {
            message,
            status,
            timestamp: new Date().toISOString(),
        },
    });
};
