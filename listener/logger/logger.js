const winston = require('winston');
const { SeqTransport } = require('@datalust/winston-seq');

const customLevels = {
    levels: {
        critical: 0,
        error: 1,
        warn: 2,
        info: 3,
        debug: 4,
        http: 6,
        database: 8
    },
    colors: {
        critical: 'bold red blueBG',
        error: 'red',
        warn: 'yellow whiteBG',
        info: 'white',
        debug: 'gray greenBG',
        http: 'gray',
        database: 'green'
    }
};

winston.addColors(customLevels.colors);

let logger;
function getLogger() {
    try {
        if (!logger) {
            logger = winston.createLogger({
                level: 'database',
                levels: customLevels.levels,
                defaultMeta: {
                    service: 'ebay-scan'
                },
                transports: [
                    new winston.transports.Console({
                        format: winston.format.combine(
                            winston.format.simple()
                        ),
                    }),
                    new SeqTransport({
                        format: winston.format.simple(),
                        serverUrl: process.env.SEQ_URL,
                        onError: (e => { logger.error(e) }),
                        handleExceptions: true,
                        handleRejections: true,
                    })
                ]
            });
        }
        return logger;
    } catch (e) {
        console.error('Error creating logger:', e);
    }
}

module.exports = { getLogger };
