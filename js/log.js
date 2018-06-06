const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, prettyPrint, printf } = format;

const logger = createLogger({
    level: 'info',
    format: combine(
        label({ label: 'fund-clearing-app' }),
        timestamp(),
        prettyPrint(),
        printf(i => `${i.timestamp} [${i.label}] ${JSON.stringify(i.message, null, 4)}`)
    ),
    transports: [ new transports.Console() ]
});

logger.info('Winston logging initialized and ready.');

module.exports=logger;
