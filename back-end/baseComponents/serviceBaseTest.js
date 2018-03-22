'use strict';
let Model = require('baseComponents/model');

class ServiceBaseTest {
    /**
     * Service test describe
     * @param description {string}
     * @param tests {function} tests
     */
    static describe(description, tests) {
        describe(description, function() {
            beforeEach(async () => {
                ServiceBaseTest.dbOptions.transaction = await Model.transaction();
            });

            afterEach(function() {
                ServiceBaseTest.dbOptions.transaction.rollback();
            });

            tests();
        });
    }
}

ServiceBaseTest.dbOptions = {
    transaction: null
};

module.exports = ServiceBaseTest;
