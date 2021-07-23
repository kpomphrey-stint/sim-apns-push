import { Application } from 'express';
import proxy from 'express-http-proxy';
import { logger } from './utils/logger';
import { API_PATH, PROXY_API, PROXY_HTTPS } from './config';
import { register } from './utils/fcm';

export enum OverrideRoutes {
  DEVICE_TOKEN = '/comms/device_token/',
}

type DeviceTokenPayload = {
  firebase_registration_id: string;
  platform: string;
};

/**
 * Takes in a proxy req body and injects
 * the new token for this service to recieve
 * cloud messages
 *
 * @param {object} body
 */
const overrideDeviceToken = async (body: DeviceTokenPayload): Promise<DeviceTokenPayload> => {
  // Register for a new token to inject into the body
  const token = await register(body.firebase_registration_id);

  if (!token) {
    logger.warn('Unable to inject new token');
    return body;
  }

  logger.info(`Injecting new token into body: ${token}`);

  return {
    ...body,
    firebase_registration_id: token,
  };
};

/**
 * Proxy all calls to the proxy API
 *
 * @param {object} app The express app instance
 */
export const attachProxy = (app: Application) => {
  if (!PROXY_API) {
    logger.warn('PROXY_API is missing');
    return;
  }

  app.use(
    proxy(PROXY_API, {
      https: PROXY_HTTPS,
      proxyReqBodyDecorator: async (body, req) => {
        const path = req.path.replace(API_PATH, '');

        if (path === OverrideRoutes.DEVICE_TOKEN) {
          return overrideDeviceToken(body);
        }

        return body;
      },
    })
  );
};
