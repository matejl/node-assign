
const auth = require('../app/auth');
const output = require('../app/output');
const validation = require('../app/validation');
const User = require('../models/user');

/**
 * Returns currently logged in user data.
 */
module.exports.index = async (req, res, next) => {

    try {
        let user = await User.findById(req.user.data.userId);
        output.result(res, {
            userId: user.userId,
            username: user.username
        })
    } catch (e) {
        console.log(e);
        next(e);
    }

};

/**
 * Allows user to update password.
 */
module.exports.updatePassword = async (req, res, next) => {

    let newPassword;
    try {
        newPassword = validation.paramMandatory(req, 'password', 'string');
    } catch (err) {
        output.error(res, err);
        return;
    }

    let user;
    try {
        user = await User.findById(req.user.data.userId);
    } catch (err) {
        next(err);
        return;
    }

    user.passwordHash = auth.hashPassword(newPassword);
    try {
        let nRowsUpdated = await User.update(user);
        if (nRowsUpdated === 0) {
            output.error(res, 'Specified user was not found');
            return;
        }
    } catch (err) {
        output.error(res, 'Password could not be updated');
        return;
    }

    output.result(res, {
        success: true
    });

};