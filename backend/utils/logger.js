const levels = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG'
};

const formatMessage = (level, message) => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level}] ${message}`;
};

export const logger = {
  info: (msg) => console.log(formatMessage(levels.INFO, msg)),
  warn: (msg) => console.warn(formatMessage(levels.WARN, msg)),
  error: (msg, err) => {
    console.error(formatMessage(levels.ERROR, msg));
    if (err) console.error(err);
  },
  debug: (msg) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(formatMessage(levels.DEBUG, msg));
    }
  }
};

export default logger;
