import { logger } from './application/logging.js';
import { web } from './application/web.js';

web.listen(process.env.PORT || 8080, () => {
  logger.info('App Start!');
});

