import os from 'os';
import { createLogger, format, transports } from 'winston';
import config from './config/index';

const { combine, timestamp, label, json, printf } = format;

const stringFormat = printf(info => {
  return `${info.timestamp} - ${os.hostname()} [${info.label}] ${info.level}: ${info.message}`;
});

let logFormat;

if (config.log.format === 'json') {
  logFormat = combine(
    label({ label: config.name }),
    timestamp(),
    json()
  );
} else {
  logFormat = combine(
    label({ label: config.name }),
    timestamp(),
    format.align(),
    stringFormat,
  );
}

const logTransports: any = [];

if (config.log.file) {
  logTransports.push(new transports.File({ filename: config.log.file }));
}

if (config.log.errorFile) {
  logTransports.push(new transports.File({ filename: config.log.errorFile, level: 'error' }));
}

if (config.log.console) {
  logTransports.push(new transports.Console({
    format: combine(
      label({ label: config.name }),
      timestamp(),
      format.align(),
      format.colorize(),
      stringFormat,
    )
  }));
}

const logger = createLogger({
  format: logFormat,
  level: config.log.level,
  transports: logTransports,
});

export default logger;
