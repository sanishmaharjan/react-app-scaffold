'use strict';
let express = require('express');
let mainApplication = require('config/main');
let Model = require('baseComponents/model');

global.app = module.exports = express();
mainApplication.configureModules();

class ControllerBaseTest {
    /**
     * Controller test describe
     * @param description {string}
     * @param tests {function} tests
     */
    static describe(description, tests) {
        describe(description, function() {
            beforeEach(async () => {
                ControllerBaseTest.dbOptions.transaction = await Model.transaction();
            });

            afterEach(function() {
                ControllerBaseTest.dbOptions.transaction.rollback();
            });

            tests();
        });
    }

    static mockRouter(router){
        router(global.app);
    }
}

ControllerBaseTest.app = global.app;
ControllerBaseTest.dbOptions = {
    transaction: null
};

module.exports = ControllerBaseTest;
