import UrlHelper from 'utilities/urlHelper';

const urlHelper = new UrlHelper();
require('utilities/__mocks__/location-mock');
describe('UrlHelper', () => {
    it('Should return valid values', () => {
        expect(urlHelper.originPath()).toEqual('http://localhost');
        expect(urlHelper.fullPath()).toEqual('/react-app');
    });
});
