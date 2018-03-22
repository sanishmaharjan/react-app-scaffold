'use strict';
let Controller = require('baseComponents/controller');
let _ = require('lodash');

class ApiController extends Controller {
    constructor(representation) {
        super();
        this._representation = _.merge({}, {
            default: (data) => {
                return _.reduce(data, (result, value, key) => {
                    result[key] = value;
                    return result;
                }, {});
            }
        }, representation);
    }

    /**
     * Set API Data representation
     * @param rep {object}
     */
    set representation(rep) {
        this._representation = rep;
    }

    getApiDataRepresentation(representation, data) {
        let self = this;
        let representationList = Object.keys(this._representation);
        let apiDataRepresentation = representationList.indexOf(representation) !== -1 ? representation : 'default';
        if (_.isArray(data)) {
            return _.reduce(data, (result, value) => {
                result.push(self._representation[apiDataRepresentation](value));
                return result;
            }, []);
        }

        return self._representation[apiDataRepresentation](data);
    }
}

module.exports = ApiController;
