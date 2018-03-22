'use strict';
let fs = require('fs-extra'); //File System - for file manipulation
let formidable = require('formidable');
let logger = require('baseComponents/logger');
let moment = require('moment');

/**
 * Return post form data
 * @param {object} req request
 * @returns {Promise}
 */
exports.getFormData = function(req) {
    return new Promise(function(resolve, reject) {
        try {
            let form = new formidable.IncomingForm();
            form.parse(req, function(err, fields, files) {
                let data = fields;
                data.files = files;
                return resolve(data);
            });
        } catch (error) {
            logger.error(error);
            return reject('Fail to get form data');
        }
    });
};

/**
 * Upload form file to specific path
 * @param {object} file request
 * @param {string} uploadPath path to upload file
 * @returns {Promise}
 */
exports.uploadFile = function(file, uploadPath) {
    return new Promise(function(resolve, reject) {
        try {
            if (file.name != '') {
                let newFileName = moment().format('x-') + file.name;
                fs.move(file.path, uploadPath + '/' + newFileName, (error) => {
                    if (!error) {
                        return resolve(newFileName);
                    } else {
                        logger.error(error);
                        return reject('Fail to upload file');
                    }
                });
            } else {
                return resolve(file.name);
            }
        } catch (error) {
            logger.error(error);
            return reject('Fail to upload file');
        }
    });
};
