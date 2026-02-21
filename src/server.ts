import app from './app';
import { logger } from './utils/logger';

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});

process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        logger.info('HTTP server closed');
    });
});
