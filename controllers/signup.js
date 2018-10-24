const User = require('../models/user');
const auth = require('../app/auth');
const output = require('../app/output');
const validation = require('../app/validation');

/**
 * Performs signup.
 */
module.exports.index = async (req, res, next) => {

    let username;
    let password;

    try {
        username = validation.paramMandatory(req, 'username', 'string');
        password = validation.paramMandatory(req, 'password', 'string');
    } catch (err) {
        output.error(res, err);
        return;
    }

    try {
        let users = await User.findAllBy('username', username);
        if (users.length > 0) {
            output.error(res, 'Specified username already exists.');
            return;
        }
    } catch (err) {
        next(err);
        return;
    }

    try {
        let user = new User(null, username, auth.hashPassword(password));
        let nAffectedRows = await User.add(user);
        if (nAffectedRows === 0) {
            output.error(res, 'User could not be added.');
            return;
        }
        output.result(res, {
            "success": true,
        });
    } catch (err) {
        next(err);
    }

};