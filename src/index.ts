import express from 'express';
import cors from 'cors';
import { fcmToApns } from 'express-fcm-to-apns';
import {
  API_PATH,
  API_PORT,
  APNS_DIR,
  APNS_SIMULATOR_UUID,
  APNS_TARGET_BUNDLE,
  PROXY_API,
  PROXY_HTTPS,
  SENDER_ID,
} from './config';
import { logger } from './utils/logger';

const start = () => {
  const app = express();

  app.use(cors());
  app.use(
    fcmToApns({
      apiUrl: PROXY_API!,
      apns: {
        dir: APNS_DIR,
        targetBundle: APNS_TARGET_BUNDLE!,
        targetDevice: APNS_SIMULATOR_UUID,
      },
      interceptPath: API_PATH + '/comms/device_token/',
      senderId: SENDER_ID!,
      tokenPath: ['firebase_registration_id'],
      proxyOpts: {
        https: PROXY_HTTPS,
      },
      logger,
    })
  );

  app.listen(API_PORT, () => {
    logger.info(`📲 iOS APNS proxy running on port ${API_PORT}`);
  });
};

start();
