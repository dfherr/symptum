// module dependencies
const winston = require('winston');
const fs = require('fs');

// custom dependencies
const config = require('./config');

// create /logs directory if it does not yet exist
fs.existsSync(config.logfile.path) || fs.mkdirSync(config.logfile.path);

// the logger configuration
const logger = winston.createLogger({
    // error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5
    level: 'info',
    // format: winston.format.json(),
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.simple(),
        winston.format.printf(msg => `${msg.timestamp} - ${msg.level}: ${msg.message}`),
    ),
    // log files
    transports: [
        new winston.transports.File({ filename: `${config.logfile.path}${config.logfile.fileName}` }),
    ],
});

// if not in production or test: Log to the console with the format:
// ${info.level}: ${info.message} JSON.stringify({ ... })
if (process.env.NODE_ENV !== 'prod' && process.env.NODE_ENV !== 'test') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize({
                all: true,
            }),
            winston.format.simple(),
        ),
    }));
}

module.exports = logger;
