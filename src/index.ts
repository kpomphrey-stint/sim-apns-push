import cors from 'cors';
import express from 'express';

import { API_PORT, DEBUG_VERBOSE } from './config';
import { attachProxy } from './proxy';
import { expressLogger, logger } from './utils/logger';
import { isMac } from './utils/os';

const start = () => {
  const app = express();

  if (!isMac()) {
    logger.warn('This proxy service is only intended for macOS');
  }

  app.use(cors());

  if (DEBUG_VERBOSE) {
    app.use(expressLogger());
  }

  attachProxy(app);

  app.listen(API_PORT, () => {
    logger.info(`📲 iOS APNS proxy running on port ${API_PORT}`);
  });
};

start();
