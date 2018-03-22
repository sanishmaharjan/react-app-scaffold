'use strict';

let auth = require('basic-auth');
let encrypter = require('node-password-encrypter');
let logger = require('baseComponents/logger');

let UserService = require('services/userService');
class Auth {
    /**
     * Authenticate user
     * @param req {object} Request
     * @returns {boolean}
     */
    static async authenticate(req) {
        let isAuthenticated = false;
        let creds = auth(req);

        if (creds) {
            isAuthenticated = await Auth.login(creds, req);
        } else if (req.session.userUuid) {
            logger.info('Login User Uuid: %s', req.session.userUuid);
            isAuthenticated = true;
        }

        return isAuthenticated;
    }

    /**
     * Login User
     * @param creds {object} dataFormat {name: value, pass: value}
     * @param req {object} Request
     * @returns {boolean}
     */
    static async login(creds, req) {
        let user = await UserService.getUserByUserName(creds.name);
        if (user != null && (await Auth.isValidUser(creds, user))) {
            req.session.userUuid = user.uuid;
            req.session.user = user.userName;
            return true;
        }

        return false;
    }

    /**
     * Validate User credential
     * @param creds{object} dataFormat {name: value, pass: value}
     * @param user {User} user Model
     * @returns {boolean}
     */
    static async isValidUser(creds, user) {
        let isValidPassword = await encrypter.compare({
            content: creds.pass,
            encryptedContent: user.password,
            salt: user.salt,
            keylen: 64
        });

        return creds.name === 'admin' && isValidPassword;
    }
}

module.exports = Auth;
