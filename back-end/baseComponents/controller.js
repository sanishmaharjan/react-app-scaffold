'use strict';
let expressController = require('express-ctrlr');

class Controller {
    constructor() {
        this._controller = expressController();
        this._controllerFileName = '';
        this._controllerName = '';
        this._uri = '';
    }

    /**
     * return controller
     * @returns {*}
     */
    get controller() {
        return this._controller;
    }

    /**
     * Get controller File Name
     * @returns {string}
     */
    get controllerFileName() {
        return this._controllerFileName;
    }

    /**
     * Set controller File Name
     * @param fileName {string}
     */
    set controllerFileName(fileName) {
        this._controllerFileName = fileName;
    }

    /**
     * Get controller name
     * @returns {string}
     */
    get controllerName() {
        return this._controllerName;
    }

    /**
     * Set controller name
     * @param name {string}
     */
    set controllerName(name) {
        this._controllerName = name;
    }

    /**
     * Get controller uri
     * @returns {string}
     */
    get uri() {
        return this._uri;
    }

    /**
     * Set controller uri
     * @param uri {string}
     */
    set uri(uri) {
        this._uri = uri;
    }

    /**
     * Default router
     * @param controller {Object}
     */
    router(controller) {
        let self = this;
        controller.index(function(req, res, next) {
            res.end('GET : /' + self.controllerName);
        });
    }

    /**
     * Setup controller route
     * @param fullFilePath {string} controller fileName with full path
     * @returns {module}
     */
    route(fullFilePath) {
        if (this.isValidFile(fullFilePath)) {
            this.router(this.controller);
            global.app.use(this.uri, this.controller.router());
        }

        return this;
    }

    /**
     * Check controller file name valid
     * @param fullFilePath {string} full controller file path
     * @returns {boolean}
     */
    isValidFile(fullFilePath) {
        this.controllerFileName = fullFilePath.split(/\\|\//).pop();
        if (this.controllerFileName.lastIndexOf('Controller') !== -1) {
            this.controllerName = this.controllerFileName.substring(
                0,
                this.controllerFileName.lastIndexOf('Controller')
            );
            let parseFullFilePath = fullFilePath.match(/controllers(.*)\//);
            this.uri =
                typeof parseFullFilePath[1] !== 'undefined'
                    ? parseFullFilePath[1] + '/' + this.controllerName
                    : '/' + this.controllerName;

            return true;
        } else {
            throw new Error('500 Invalid controller file name');
        }
    }
}

/**
 * @memberOf Controller
 * @type {Controller}
 */
module.exports = Controller;
