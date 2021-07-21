import { createLogger, transports, format } from 'winston';
import expressWinston, { LoggerOptions } from 'express-winston';

const { Console } = transports;
const { colorize, json, combine, simple } = format;

export const logger = createLogger({
  level: 'info',
  transports: [
    new Console({
      format: combine(colorize(), simple()),
    }),
  ],
});

export const expressLogger = () =>
  expressWinston.logger({
    transports: [
      new Console({
        format: combine(colorize(), json()),
      }),
    ],
  });
