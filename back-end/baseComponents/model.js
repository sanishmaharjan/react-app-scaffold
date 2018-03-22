'use strict';
let env = process.env.NODE_ENV || 'runtime';
let Sequelize = require('sequelize');
let config = require('config/config')[env];

let Model = new Sequelize(config.database, config.username, config.password, config);

/**
 *
 * @type {model}
 */
module.exports = Model;
