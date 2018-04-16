# Db Migration
This react-app-scaffold use [sequelize](http://sequelize.readthedocs.io/en/v3/docs/getting-started/) ORM.

## Config sequelize ORM
Config following .env variables
```dotenv
NODE_ENV=runtime
DB_CLIENT=postgres
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=test_db
DB_POOL_MIN=2
DB_POOL_MAX=10
DB_LOGGING=false
```

## Skeleton
The following skeleton shows a typical migration file. All migrations are expected to be located at back-end/migrations. 
```javascript
module.exports = {
  up: function(queryInterface, Sequelize) {
    // logic for transforming into the new state
  },
 
  down: function(queryInterface, Sequelize) {
    // logic for reverting the changes
  }
}
```

## Create db migration
The following command generate db migration with basic migration code.
```bash
yarn migrate:create [migration-name]
```
Then open generated migration file and write migration script. Eg:
```javascript
'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('persons', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            uuid: {
                type: Sequelize.STRING(36),
                allowNull: false,
                unique: true
            },
            firstName: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            middleName: {
                type: Sequelize.STRING(50),
                allowNull: true
            },
            lastName: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            gender: {
                type: Sequelize.STRING(6),
                allowNull: false,
                defaultValue: 'Male'
            },
            bod: {
                type: Sequelize.DATEONLY,
                allowNull: true
            },
            isDeleted: {
                type: Sequelize.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            deleteReason: {
                type: Sequelize.DataTypes.BOOLEAN,
                allowNull: true
            },
            deletedAt: {
                type: Sequelize.DataTypes.DATE,
                allowNull: true
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: true,
                type: Sequelize.DATE
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('persons');
    }
};

```
**_For more details:_**
- [Sequelize-Migration](http://sequelize.readthedocs.io/en/v3/docs/migrations)
- [Query-Interface](http://docs.sequelizejs.com/class/lib/query-interface.js~QueryInterface.html)

## Run migration
```bash
yarn migrate:up
```

## Rollback migration
```bash
yarn migrate:down
```