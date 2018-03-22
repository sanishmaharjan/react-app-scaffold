export default class UrlHelper {
    originPath = () => {
        return window.location.origin;
    };

    fullPath = () => {
        return window.location.pathname;
    };

    apiBaseUrl = () => {
        return window.location.origin + '/api';
    };
}
