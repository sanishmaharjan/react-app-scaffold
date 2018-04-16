/**
 * load modules
 */
var express = require('express');                           //Express Web Server
var mainApplication = require("../back-end/baseComponents/main");   //load Application

let logger = require('../back-end/baseComponents/logger');
let config = require('../back-end/config/config');
/**
 * Configure express project
 */
global.app = module.exports = express();
mainApplication.appInit();

/**
 * Create server
 * @type {http.Server}
 */
global.app.listen(config.port, function(){
    logger.info('Application Environment: %s', global.app.get('env'));
    logger.info('Application listening on port: %s', this.address().port);
});
