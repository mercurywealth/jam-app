import winston from 'winston';
import 'winston-daily-rotate-file';

const logger = winston.createLogger({
  defaultMeta: { namespace: 'application' }
});
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format((info, opts) => {
                let level = info.level.toUpperCase();
                if (info.message && info.message.constructor === Object) {
                    info.message = JSON.stringify(info.message, null, 4)
                }
                info.message = `[${info['logNamespace'] || info['namespace']}] ${info.message}`
                if (level === 'VERBOSE') {
                    level = 'DEBUG';
                }
                info['severity'] = level;
                delete info.level;
                return info;
            })(),
            winston.format.json()
        )
    }));
} else {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.printf((info) => {
                if (info.stack) {
                    return `${info.timestamp} ${info.level} [${info['logNamespace'] || info['namespace']}] ${info.message}\n${info.stack}`;
                }
                    return `${info.timestamp} ${info.level} [${info['logNamespace'] || info['namespace']}] ${info.message}`
                }
            )
        )
    }));
}

export default (namespace: string) => {
  return logger.child({ logNamespace: namespace })
};
