'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.dropAllTables();
    },

    down: (queryInterface, Sequelize) => {}
};
