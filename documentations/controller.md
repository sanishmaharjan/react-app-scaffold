# Controller
MVC Controllers are responsible for controlling the flow of the application execution. 
All controllers are expected to be located at back-end/controllers.

## Controller Definition
- Eg: Basic Controller `back-end/controllers/api/homeController.js` 
```javascript
'use strict';
let Controller = require('baseComponents/controller');
let Logger = require('baseComponents/logger');
let Response = require('baseComponents/response');
let Path = require('path');

let homeController = new Controller();
homeController.router = function(controller) {
    controller.before(async (req, res, next) => {
        next();
    });

	// GET : /home
    controller.index(async (req, res, next) => {
        try {
            // get home.html view from location front-end/webApp/home.html 
            Response.render(res, 'home', {});
        } catch (error) {
            Logger.warn(error);
            Response.renderErrorPage(res, error.statusCode ? error.statusCode : '500', error);
        }
    });
    
    // GET : /home/page
    controller.action('/page', {method: 'GET'}, async (req, res, next) => {
		res.send('Page 1');
		res.end();
	});
};

homeController.route(Path.resolve(__filename));
module.exports = homeController;
```

- Api Controller Eg: `back-end/controllers/api/personController.js`

```javascript
'use strict';
let Path = require('path');
let ApiController = require('baseComponents/apiController');
let Logger = require('baseComponents/logger');
let Response = require('baseComponents/response');
let Auth = require('baseComponents/auth');

let PersonService = require('services/personService');
let DataProcessor = require('utilities/dataProcessor');

let personApiController = new ApiController({
    full: (data) => {
        return {
            uuid: data.uuid,
            firstName: data.firstName,
            middleName: data.middleName,
            lastName: data.lastName,
            fullName: data.fullName,
            gender: data.gender,
            bod: data.bod
        };
    },
    default: (data) => {
        return {
            uuid: data.uuid,
            fullName: data.fullName,
            gender: data.gender
        };
    }
});

personApiController.router = function (controller) {
    controller.before(async (req, res, next) => {
        // before action check authentication
        if (await Auth.authenticate(req)) {
            next();
        } else {
            Response.responseApiDenied(res);
        }
    });
    controller.index(async (req, res, next) => {
        // GET : /api/person
        try {
            let parameters = await DataProcessor.getFormData(req);
            let personDataList = await PersonService.getAllPersons();
            let apiDataRepresentation = parameters.v ? parameters.v : 'default';
            let responseData = personApiController.getApiDataRepresentation(apiDataRepresentation, personDataList);
            Response.responseApi(res, responseData);
        } catch (error) {
            Logger.error(error);
            Response.responseApiError(res, '500', error.message ? error.message : error);
        }
    });
    controller.action('/:uuid', {method: 'GET'}, async (req, res, next) => {
        // GET : /api/person/:uuid
        let uuid = req.params.uuid;
        let parameters = await DataProcessor.getFormData(req);
        try {
            let personData = await PersonService.getPersonByUuid(uuid);
            let apiDataRepresentation = parameters.v ? parameters.v : 'default';
            let responseData = personApiController.getApiDataRepresentation(apiDataRepresentation, personData);
            Response.responseApi(res, responseData);
        } catch (error) {
            Logger.error(error);
            Response.responseApiError(res, '500', error.message ? error.message : error);
        }
    });
};

personApiController.route(Path.resolve(__filename));
module.exports = personApiController;
```

- Api Controller Eg: `back-end/controllers/api/authenticationController.js`
```javascript
'use strict';
let ApiController = require('baseComponents/apiController');
let Logger = require('baseComponents/logger');
let Path = require('path');
let AuthenticationService = require('services/authenticationService');
let Response = require('baseComponents/response');
let Auth = require('baseComponents/auth');
let HttpError = require('baseComponents/httpError');
let DataProcessor = require('utilities/dataProcessor');

let authenticationController = new ApiController({
    default: (user) => {
        if (user) {
            return {
                uuid: user.uuid,
                userName: user.userName,
                person: {
                    uuid: user.person.uuid,
                    fullName: user.person.fullName,
                    gender: user.person.gender
                },
                isLogin: true
            };
        } else {
            return {
                isLogin: false
            };
        }
    }
});

authenticationController.router = function (controller) {
    controller.before(async (req, res, next) => {
        // before action execute before every action
        next();
    });

    controller.index(async (req, res, next) => {
        // GET : /api/authentication
        try {
            let loginUser = await AuthenticationService.getLoginUser(req.session);
            let responseData = authenticationController.getApiDataRepresentation('default', loginUser);
            Response.responseApi(res, responseData);
        }
        catch (error) {
            Logger.warn(error);
            Response.responseApiError(res, error.statusCode ? error.statusCode : '500', error.message ? error.message : error);
        }
    });

    controller.action('/', {method: 'POST'}, async (req, res, next) => {
        // POST : /api/authentication
        try {
            let postData = await DataProcessor.getFormData(req);
            if (!postData.userName || !postData.password) {
                throw new HttpError(406, 'Missing require params [userName, password]');
            }

            let creds = {
                name: postData.userName,
                pass: postData.password
            };

            if (await Auth.login(creds, req)) {
                let userData = await AuthenticationService.getLoginUser(req.session);
                let responseData = authenticationController.getApiDataRepresentation('default', userData);
                Response.responseApi(res, responseData);
            } else {
                throw new HttpError(401, 'Invalid UserName or Password');
            }
        } catch (error) {
            Logger.warn(error);
            Response.responseApiError(res, error.statusCode ? error.statusCode : '500', error.message ? error.message : error);
        }
    });
    
    controller.action('/logout', {method: 'GET'}, async (req, res, next) => {
        // GET : /api/authentication
        try {
            req.session.destroy(() => {
                let responseData = authenticationController.getApiDataRepresentation('default', null);
                Response.responseApi(res, responseData);
            });
        } catch (error) {
            Logger.warn(error);
            Response.responseApiError(res, error.statusCode ? error.statusCode : '500', error.message ? error.message : error);
        }
    });
};

authenticationController.route(Path.resolve(__filename));
module.exports = authenticationController;
```

## Testing Api Controller
- Service testing base class `ControllerBaseTest`.

- Example of testing `personController.js`
```javascript
'use strict';
let chai = require('chai');
let assert = chai.assert;
let request = require('supertest');
let ControllerBaseTest = require('baseComponents/controllerBaseTest');

require('controllers/api/personController');
ControllerBaseTest.describe('person Api tests', () => {
    it('Should return 401 status for unAuthorize access', (done) => {
        request(ControllerBaseTest.app)
            .get('/api/person')
            .send({v: 'full'})
            .end((err, res) => {
                assert.equal(401, res.statusCode);
                assert.equal('Access denied', res.text);
                done();
            });
    });

    it('Should return all persons', (done) => {
        request(ControllerBaseTest.app)
            .get('/api/person')
            .set({Authorization: 'Basic YWRtaW46YWRtaW4hQCM='})
            .send({v: 'full'})
            .end((err, res) => {
                //console.log(res.text);
                const data = res.body;

                assert.equal(200, res.statusCode);
                assert.equal(3, data.length);

                assert.deepEqual(
                    {
                        fullName: 'Sanish Maharjan',
                        uuid: '98520d95-0f7e-4921-a49f-73c8792ae43e',
                        firstName: 'Sanish',
                        middleName: null,
                        lastName: 'Maharjan',
                        gender: 'Male',
                        bod: '1988-10-20 00:00:00.000 +00:00'
                    },
                    {
                        fullName: data[0].fullName,
                        uuid: data[0].uuid,
                        firstName: data[0].firstName,
                        middleName: data[0].middleName,
                        lastName: data[0].lastName,
                        gender: data[0].gender,
                        bod: data[0].bod
                    }
                );

                assert.deepEqual(
                    {
                        fullName: 'Rita Maharjan',
                        uuid: '46a61768-f606-42c8-8b9e-d6c16e458339',
                        firstName: 'Rita',
                        middleName: null,
                        lastName: 'Maharjan',
                        gender: 'Female',
                        bod: null
                    },
                    {
                        fullName: data[2].fullName,
                        uuid: data[2].uuid,
                        firstName: data[2].firstName,
                        middleName: data[2].middleName,
                        lastName: data[2].lastName,
                        gender: data[2].gender,
                        bod: data[2].bod
                    }
                );

                done();
            });
    });

    it('Should return person by Uuid', (done) => {
        request(ControllerBaseTest.app)
            .get('/api/person/98520d95-0f7e-4921-a49f-73c8792ae43e')
            .set({Authorization: 'Basic YWRtaW46YWRtaW4hQCM='})
            .send({v: 'full'})
            .end((err, res) => {
                const data = res.body;

                assert.equal(200, res.statusCode);
                assert.isNotEmpty(data);
                assert.deepEqual(
                    {
                        fullName: 'Sanish Maharjan',
                        uuid: '98520d95-0f7e-4921-a49f-73c8792ae43e',
                        firstName: 'Sanish',
                        middleName: null,
                        lastName: 'Maharjan',
                        gender: 'Male',
                        bod: '1988-10-20 00:00:00.000 +00:00'
                    },
                    {
                        fullName: data.fullName,
                        uuid: data.uuid,
                        firstName: data.firstName,
                        middleName: data.middleName,
                        lastName: data.lastName,
                        gender: data.gender,
                        bod: data.bod
                    }
                );

                done();
            });
    });
});
```

- Example of testing `authenticationController.js`
```javascript
'use strict';
let chai = require('chai');
let assert = chai.assert;
let request = require('supertest');

let ControllerBaseTest = require('baseComponents/controllerBaseTest');
require('controllers/api/authenticationController');

ControllerBaseTest.describe('Authentication Api tests', () => {
    it('Should send user login false if user not login', (done) => {
        request(ControllerBaseTest.app)
            .get('/api/authentication')
            .end((err, res) => {
                const data = res.body;

                assert.equal(200, res.statusCode);
                assert.isFalse(data.isLogin);
                assert.isUndefined(data.uuid);
                done();
            });
    });

    it('Should login user if valid credential provided', (done) => {
        request(ControllerBaseTest.app)
            .post('/api/authentication')
            .send({
                userName: 'admin',
                password: 'admin!@#'
            })
            .end((err, res) => {
                const data = res.body;

                assert.equal(200, res.statusCode);
                assert.isTrue(data.isLogin);
                assert.equal('2a1abd9c-86a1-4971-93f4-dd139f70f15d', data.uuid);
                assert.equal('admin', data.userName);
                assert.equal('Sanish Maharjan', data.person.fullName);

                done();
            });
    });

    it('Should throw 401 statusCode if invalid credential provided', (done) => {
        request(ControllerBaseTest.app)
            .post('/api/authentication')
            .send({
                userName: 'admin',
                password: 'invalidPassword'
            })
            .end((err, res) => {
                const data = res.body;

                assert.equal(401, res.statusCode);
                assert.equal('Invalid UserName or Password', data.message);

                done();
            });
    });

    it('Should throw 406 statusCode if require params not provided', (done) => {
        request(ControllerBaseTest.app)
            .post('/api/authentication')
            .end((err, res) => {
                const data = res.body;

                assert.equal(406, res.statusCode);
                assert.equal('Missing require params [userName, password]', data.message);

                done();
            });
    });

    it('Should return user info if already login', async () => {
        let requestLogin = await request(ControllerBaseTest.app)
            .post('/api/authentication')
            .send({
                userName: 'admin',
                password: 'admin!@#'
            });

        let requestLoginUserInfo = await request(ControllerBaseTest.app)
            .get('/api/authentication')
            .set('Cookie', requestLogin.header['set-cookie']);

        let loginUserInfo = requestLoginUserInfo.body;
        assert.isTrue(loginUserInfo.isLogin);
        assert.equal('2a1abd9c-86a1-4971-93f4-dd139f70f15d', loginUserInfo.uuid);
        assert.equal('admin', loginUserInfo.userName);
        assert.equal('Sanish Maharjan', loginUserInfo.person.fullName);
    });

    it('Should logout current login user', async () => {
        let requestLogin = await request(ControllerBaseTest.app)
            .post('/api/authentication')
            .send({
                userName: 'admin',
                password: 'admin!@#'
            });

        let requestLogOut = await request(ControllerBaseTest.app)
            .get('/api/authentication/logout')
            .set('Cookie', requestLogin.header['set-cookie']);

        let response = requestLogOut.body;
        assert.isFalse(response.isLogin);
        assert.isUndefined(response.uuid);
    });
});
```