declare global {
  namespace NodeJS {
    interface ProcessEnv {
      API_PATH: string;
      API_PORT: number;
      DEBUG_VERBOSE: string;

      SENDER_ID: string;

      PROXY_API: string;
      PROXY_HTTPS: string;

      APNS_DIR: string;
      APNS_SIMULATOR_UUID: string;
      APNS_TARGET_BUNDLE?: string;
    }
  }
}
