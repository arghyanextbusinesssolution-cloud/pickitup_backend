import app from './app';
import { env } from './config/env';
import { logger } from './utils/logger';

const port = Number(env.PORT);

app.listen(port, '0.0.0.0', () => {
    logger.info(`Server is running on port ${port}`);
});
