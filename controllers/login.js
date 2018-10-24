const User = require('../models/user');
const auth = require('../app/auth');
const config = require('../config');
const output = require('../app/output');
const validation = require('../app/validation');
const jwt = require('jsonwebtoken');

/**
 * Login function. Tries to login and throws error if username / password missing or if there is no match in database.
 */
module.exports.index = async (req, res, next) => {

    let username;
    let password;

    try {
        username = validation.paramMandatory(req, 'username', 'string');
        password = validation.paramMandatory(req, 'password', 'string');
    } catch (err) {
        output.error(res, err.message);
        return;
    }

    // find user with specified credentials
    let user;
    try {
        let users = await User.findAllByUserCredentials(username, auth.hashPassword(password));
        // no user with specified credentials
        if (users.length === 0) {
            output.error(res, 'No such user. Check username and password');
            return;
        }
        user = users[0];
    } catch (err) {
        next(err);
        return;
    }

    let token = jwt.sign({
        data: {
            userId: user.userId,
            userName: user.username
        }
    }, config.auth.jwtSecret, {
        expiresIn: '7d',
        algorithm: 'HS256'
    });

    output.result(res, {
        success: true,
        jwtToken: token,
        userId: user.userId
    })

};