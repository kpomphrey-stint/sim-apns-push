import { Notification, Event } from 'push-receiver';
import hash from 'object-hash';
import { pipe } from 'ramda';
import { APNS_DIR, APNS_SIMULATOR_UUID, APNS_TARGET_BUNDLE } from '../config';
import fs from 'fs';
import { logger } from './logger';
import { isMac } from './os';
import { spawn } from 'child_process';

type Apns = {
  'Simulator Target Bundle'?: string;
  aps: {
    alert: Event['notification']['notification'];
    badge?: number;
    data?: Event['notification']['data'];
    'content-available'?: number;
    'mutable-content'?: number;
  };
};

/**
 * Return the APNS shape
 *
 * @param {object} event
 */
const createApns = (event: Event) => {
  if (!APNS_TARGET_BUNDLE) {
    logger.warn('APNS_TARGET_BUNDLE is missing');
    return;
  }

  const apns: Apns = {
    aps: {
      alert: event.notification.notification,
      data: event.notification.data,
    },
    'Simulator Target Bundle': APNS_TARGET_BUNDLE,
  };

  logger.info(`Received notification... creating APNS: ${JSON.stringify(apns)}`);

  // Hash the object so we always use the same file for the same
  // notification
  const fileName = `${APNS_DIR}/${hash(apns)}.apns`;

  try {
    fs.writeFileSync(fileName, JSON.stringify(apns));
    return fileName;
  } catch (e) {
    logger.error(e);
  }
};

/**
 * Take a path to an APNS file and execute it
 *
 * @param {object} apns
 */
const executeApns = (apnsFilePath?: string) => {
  if (!apnsFilePath) return;

  if (!isMac()) {
    logger.warn(`Cannot execute APNS on OS ${process.platform}. Make sure you are running macOS`);
    return;
  }

  if (!APNS_SIMULATOR_UUID) {
    logger.warn('APNS_SIMULATOR_UUID is missing');
    return;
  }

  if (!APNS_TARGET_BUNDLE) {
    logger.warn('APNS_TARGET_BUNDLE is missing');
    return;
  }

  const xcrun = spawn('xcrun', ['simctl', 'push', APNS_SIMULATOR_UUID, APNS_TARGET_BUNDLE, apnsFilePath]);

  xcrun.on('data', logger.info);
  xcrun.on('error', logger.error);
  xcrun.on('close', () => logger.info(`APNS ${apnsFilePath} pushed successfully!`));
};

/**
 * Take a notification and push it
 * to the simulator
 *
 * @param {object} notification
 */
export const push = pipe(createApns, executeApns);
