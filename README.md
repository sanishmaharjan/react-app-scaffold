# React-App-Scaffold framework
> React node app scaffold framework.

## Folder & main files Structure
- **_back-end_** (back end server side code)
	- **_baseComponents_** (framework base components)
		- **_apiController.js_** 
		- **_auth.js_**
		- **_controller.js_**
		- **_controllerBaseTest.js_**
		- **_httpError.js_**
		- **_logger.js_**
		- **_main.js_**
		- **_model.js_**
		- **_requestDataHandler.js_**
		- **_response.js_**
		- **_serviceBaseTest.js_**
	- **_config_** (framework configurations)
		- **_config.js_**
		- **_constants.js_**
	- **_controllers_** 
	- **_migrations_** (Db migration files)
	- **_models_**
	- **_services_**
	- **_tests_** (back end tests)
		- **_db_**
		- **_testDatas_** 
			- **_seeders_** (test data seeders)
			- **_dbCleanUp.js_** (clean up script that run before every test)
		- **_testFiles_**
	- **_utilities_**
- **_front-end_** (Front end react code)
	- **_components_** (React components)
	- **_utilities_**
	- **_webApp_** (root static directory)
		- **_build_**
		- **_css_**
		- **_error_**
		- **_js_**
- **_server_** (Node server script)
	- **_process_**
		- **_development.js_** (development env server config)
		- **_production.js_** (production env server config)
	- **_server.js_**
- **_.env.temp_** (.env reference)
- **_.jest.js_**
- **_.prettierrc.js_** (code formatter config)
- **_.sequelizerc_** (Db configurations)
- **_package.json_**
- **_webpack.config.js_**

## Commands:
_**Dev server start**_
```bash
# Start dev server
yarn server:start:dev 

# Start production server
yarn server:start:production
```

**_Stop server_**
```bash
yarn server:stop
```

**_View server log_**
```bash
yarn server:log
```

_**View server monitor**_
```bash
yarn server:monitor
```

**_Create new migration_**
```bash
yarn migrate:create [migration-name]
```

**_Run migration_**
```bash
yarn migrate:up
```

**_Rollback migration_**
```bash
yarn migrate:down
```

_**Test data seed**_ 
```bash
yarn test:seed:generate [name]
```

**_Run backend tests_**
```bash
yarn test:backEnd
```

**_Run frontend test_**
```bash
yarn test:frontEnd
```

_**Webpack frontend**_
```bash
yarn webpack
```

_**Build frontend**_
```bash
yarn build
```

## More Reference
- [Documentation](documentations/Documentation.md)

# Links
- DB ORM: http://docs.sequelizejs.com/manual/installation/getting-started.html
- Session: https://github.com/expressjs/session
- Basic Auth: https://www.npmjs.com/package/basic-auth
- Uuid: https://www.npmjs.com/package/uuid
- password encrypter: https://www.npmjs.com/package/node-password-encrypter