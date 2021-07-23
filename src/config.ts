import { config } from 'dotenv-flow';

config();

const { DEBUG_VERBOSE: ENV_DEBUG_VERBOSE = 'false', PROXY_HTTPS: ENV_PROXY_HTTPS = 'true' } = process.env;

export const {
  // Express
  API_PATH = '/',
  API_PORT = 3080,

  // FCM
  SENDER_ID,

  // Proxy
  PROXY_API,

  // APNS
  APNS_DIR = '/tmp',
  APNS_SIMULATOR_UUID = 'booted',
  APNS_TARGET_BUNDLE,
} = process.env;

export const DEBUG_VERBOSE = ENV_DEBUG_VERBOSE === 'true';
export const PROXY_HTTPS = ENV_PROXY_HTTPS === 'true';
