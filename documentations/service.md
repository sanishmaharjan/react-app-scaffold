# Service
Service contain most of business logic. All services are expected to be located at back-end/services.

## Creating Service
- Example `Person` service.
```javascript
'use strict';
let Person = require('models/person');
module.exports = {
    getPersonByUuid: async (uuid) => {
        return await Person.findOne({
			where: {
				uuid: uuid, 
				isDeleted: false
			}
        });
    },
    getPersons: async (limit = 50, offset = 0, transaction = null) => {
        return await Person.findAll({
        	where: {
            	isDeleted: false
            }, 
            offset: offset, 
            limit: limit, 
            transaction: transaction
        });
    },
    savePerson: async (person, options) => {
        if (person.validate()) {
            return await person.save(options);
        }
    }
};
```
- Example `Conference` service.
```javascript
'use strict';
let Conference = require('models/conference');
let Op = require('sequelize/lib/operators');
module.exports = {
    getConferenceByUuid: async (uuid) => {
        return await Conference.findOne({where: {uuid: uuid}});
    },
    getConferences: async (limit = 50, offset = 0, includeCompleted = true, transaction = null) => {
        if (includeCompleted) {
            return await Conference.findAll({offset: offset, limit: limit, transaction: transaction});
        } else {
            return await Conference.findAll({
                where: {
                    startDate: {
                        [Op.gte]: new Date()
                    }
                },
                offset: limit,
                limit: offset
            });
        }
    },
    saveConference: async (conference, options) => {
        if (conference.validate()) {
            return await conference.save(options);
        }
    },
    getConferenceBySerialNumber: async (serialNumber, transaction = null) => {
        return await Conference.findOne({where: {serialNumber: serialNumber}, transaction: transaction});
    },
    getConferencesByDateRange: async (fromDate, toData) => {
        return await Conference.findAll({
            where: {
                startDate: {
                    [Op.gte]: fromDate,
                    [Op.lte]: toData
                }
            }
        });
    },
    getDueProposalConferences: async () => {
        return await Conference.findAll({
            where: {
                deadline: {
                    [Op.gte]: new Date()
                }
            }
        });
    },
    getConferencesByCountry: async (country, includeCompleted = true) => {
        if (includeCompleted) {
            return await Conference.findAll({
                where: {
                    country: country
                }
            });
        } else {
            return await Conference.findAll({
                where: {
                    country: country,
                    startDate: {
                        [Op.gte]: new Date()
                    }
                }
            });
        }
    }
};
```

## Testing Service
- Service testing base class `ServiceBaseTest`.

Example of testing `personService.spec.js`
```javascript
'use strict';
let chai = require('chai');
let assert = chai.assert;

let ServiceBaseTest = require('baseComponents/serviceBaseTest');
let Person = require('models/person');
let PersonService = require('services/personService');

ServiceBaseTest.describe('PersonService tests', () => {
    it('Should get person by Id', async () => {
        let person = await PersonService.getPersonByUuid('ffee63e5-880f-470f-b8f4-836e382f74c3');

        assert.isNotNull(person);
        assert.equal(person.id, 2);
        assert.equal(person.uuid, 'ffee63e5-880f-470f-b8f4-836e382f74c3');
        assert.equal(person.fullName, 'Manish Maharjan');
    });

    it('Should return all persons', async () => {
        let personList = await PersonService.getAllPersons();

        assert.lengthOf(personList, 3);
        assert.deepEqual(
            {
                id: personList[0].id,
                uuid: personList[0].uuid,
                firstName: personList[0].firstName,
                middleName: personList[0].middleName,
                lastName: personList[0].lastName,
                gender: personList[0].gender,
                bod: personList[0].bod
            },
            {
                id: 1,
                uuid: '98520d95-0f7e-4921-a49f-73c8792ae43e',
                firstName: 'Sanish',
                middleName: null,
                lastName: 'Maharjan',
                gender: 'Male',
                bod: '1988-10-20 00:00:00.000 +00:00'
            }
        );
        assert.deepEqual(
            {
                id: personList[1].id,
                uuid: personList[1].uuid,
                firstName: personList[1].firstName,
                middleName: personList[1].middleName,
                lastName: personList[1].lastName,
                gender: personList[1].gender,
                bod: personList[1].bod
            },
            {
                bod: '1980-02-05 00:00:00.000 +00:00',
                firstName: 'Manish',
                gender: 'Male',
                id: 2,
                lastName: 'Maharjan',
                middleName: null,
                uuid: 'ffee63e5-880f-470f-b8f4-836e382f74c3'
            }
        );
    });

    it('Should save new person', async () => {
        let person = new Person();
        person.firstName = 'New';
        person.lastName = 'Person';
        person.bod = new Date('2000-10-05');
        person.gender = 'Male';
        person.uuid = '1b671a64-40d5-491e-99b0-da01ff1f354';

        await PersonService.savePerson(person, ServiceBaseTest.dbOptions);

        assert.isNotNull(person.id);
        assert.equal(person.uuid, '1b671a64-40d5-491e-99b0-da01ff1f354');
        assert.equal(person.fullName, 'New Person');
    });
});
```

Example of 


