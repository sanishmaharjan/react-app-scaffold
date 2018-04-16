# Test Data seeder
Test data seeder are expected to be located at back-end/tests/testDatas/seeders. 
The following command generate db migration with basic migration code.

```bash
yarn test:seed:generate [name]
```

Then open generated seeder file and write insert script. Eg:
```javascript
'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert(
            'persons',
            [
                {
                    id: 1,
                    uuid: '98520d95-0f7e-4921-a49f-73c8792ae43e',
                    firstName: 'Sanish',
                    lastName: 'Maharjan',
                    bod: new Date('1988-10-20'),
                    gender: 'Male',
                    isDeleted: false,
                    createdAt: new Date()
                },
                {
                    id: 2,
                    uuid: 'ffee63e5-880f-470f-b8f4-836e382f74c3',
                    firstName: 'Manish',
                    lastName: 'Maharjan',
                    bod: new Date('1980-02-05'),
                    gender: 'Male',
                    isDeleted: false,
                    createdAt: new Date()
                },
                {
                    id: 3,
                    uuid: '46a61768-f606-42c8-8b9e-d6c16e458339',
                    firstName: 'Rita',
                    lastName: 'Maharjan',
                    gender: 'Female',
                    isDeleted: false,
                    createdAt: new Date()
                }
            ],
            {}
        );
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('persons', null, {});
    }
};
```

