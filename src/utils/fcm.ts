import { register as registerFCM, listen as listener, Credentials } from 'push-receiver';
import { SENDER_ID } from '../config';
import { logger } from './logger';
import { push } from './apns';

// In memory store for the token registered credentials
export let credentials = new Map<string, Credentials>();

/**
 * Register against the GCM and FCM
 * and start listening for messages
 *
 * @param {string} appToken This is the token generated in app
 * @param {boolean} force Whether to force a new token or not
 */
export const register = async (appToken: string, force = false) => {
  if (!SENDER_ID) {
    logger.error("Sender ID doesn't exist");
    return;
  }

  if (credentials.has(appToken) && !force) return credentials.get(appToken)!.fcm.token;

  const result = await registerFCM(SENDER_ID);
  credentials.set(appToken, { ...result });

  listen(appToken);

  return result.fcm.token;
};

/**
 * Listen for incoming messages using credentials
 *
 * @param {string} appTopken token from the application
 */
export const listen = async (appTopken: string) => {
  if (!credentials.has(appTopken)) {
    logger.warn(`Token "${appTopken}" has not been registered yet`);
    return;
  }

  await listener({ ...credentials.get(appTopken)!, persistentIds: [] }, push);
};
