'use strict';
let winston = require('winston');
let config = require('config/config');

const logger = new winston.Logger({
    transports: [new winston.transports.Console({colorize: true})]
});

//{ error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
logger.level = config.logging.level;
module.exports = logger;
