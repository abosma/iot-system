const winston = require('winston');
const { combine, timestamp, colorize, printf } = winston.format;
const path = require('path');

// Formatting copied from https://github.com/winstonjs/winston/issues/1135#issuecomment-487033104

const consoleFormat = printf(({ level, message, label, timestamp }) => {
	return `${timestamp} ${level}: ${message}`;
});

var loggingOptions = 
{
    file: 
    {
        level: 'info',
        filename: path.join(__dirname + '/logs/app.log'),
        handleExceptions: true,
        json: true,
        maxsize: 5242880,
        maxFiles: 5,
        colorize: false
    },
    console:
    {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
        format: combine(colorize(), timestamp(), consoleFormat)
    }
}

var fileLogger = new winston.transports.File(loggingOptions.file);
var consoleLogger = new winston.transports.Console(loggingOptions.console);

var logger = new winston.createLogger({
    transports: 
    [
        fileLogger,
        consoleLogger
    ],
    exitOnError: false
});

logger.stream = 
{
    write: function(message, encoding)
    {
        logger.info(message);
    }
}

module.exports = logger;