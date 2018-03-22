'use strict';
require('dotenv').config();

module.exports = {
    port: process.env.PORT || 8282,
    test: {
        dialect: 'sqlite',
        storage: 'back-end/tests/db/test-db.sqlite',
        seederStoragePath: 'sequelizeData.json',
        logging: process.env.DB_LOGGING === 'true' ? console.log : false,
        operatorsAliases: false
    },
    runtime: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST || 'localhost',
        dialect: process.env.DB_CLIENT || 'postgres',
        logging: process.env.DB_LOGGING === 'true' ? console.log : false,
        operatorsAliases: false,
        pool: {
            min: parseInt(process.env.DB_POOL_MIN) || 2,
            max: parseInt(process.env.DB_POOL_MAX) || 10,
            idle: 10000
        }
    },
    logging: {
        level: process.env.LOGGING_LEVEL || 'error'
    }
};
