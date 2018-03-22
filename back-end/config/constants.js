'use strict';
let path = require('path');

module.exports = {
    WEB_APP_PATH: path.resolve(__dirname + '/../../front-end/webApp'),
    CONTROLLER_PATH: path.resolve(__dirname + '/../controllers/'),
    DEFAULT_CONTROLLER: 'clinical'
};
