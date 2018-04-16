# Utilities
All utilities are expected to be located at back-end/utilities.

## Utilities Definition

- Example 
```javascript
'use strict';
let axios = require('axios');
let cheerio = require('cheerio');
let URL = require('url-parse');

let logger = require('baseComponents/logger');

class ConferenceWebSpider {
    static async getConferenceSerialNumbers(pageUrl, serialNumbers) {
        try {
            logger.info('Start fetching conference pages %s', pageUrl);
            let content = await axios.get(pageUrl);
            const $ = cheerio.load(content.data);
            let $table = $('.panel-body table');
            $table.find('td a').each(function (index, element) {
                let pageLink = $(element).attr('href');
                if (pageLink.indexOf('ConferenceDetail.php') !== -1) {
                    let url = new URL(pageLink, true);
                    serialNumbers.push(url.query['EVENT']);
                }
            });
            return serialNumbers;
        } catch (error) {
            logger.error(error);
        }
    }
}

module.exports = ConferenceWebSpider;
```

## Testing Utilities
- Example
```javascript
'use strict';
let axios = require('axios');
let fs = require('fs');
let path = require('path');
let MockAdapter = require('axios-mock-adapter');
let chai = require('chai');
let assert = chai.assert;

let ConferenceWebSpider = require('utilities/conferenceWebSpider');

let testFilePath = path.resolve(__dirname + '/../../files/');
describe('Conference web spider Tests', () => {
	it('Should return worldconferencealerts.com serial numbers of country', async () => {
        let mock = new MockAdapter(axios);
        const fileContent = fs.readFileSync(testFilePath +'/worldconferencealerts.com/Bahrain.html', {encoding: 'utf8'});
        mock
            .onGet('https://www.worldconferencealerts.com/Bahrain.php')
            .reply(200, fileContent);

        let serialNumbers = await ConferenceWebSpider.getConferenceSerialNumbers('https://www.worldconferencealerts.com/Bahrain.php', []);

        assert.equal(serialNumbers.length, 6);
        assert.isTrue(serialNumbers.indexOf('WLD60265') !== -1);
        assert.isTrue(serialNumbers.indexOf('WLD57717') !== -1);
    });
});
```