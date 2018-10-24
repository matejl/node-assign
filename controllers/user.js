const output = require('../app/output');
const UserLike = require('../models/userLike');
const User = require('../models/user');
const CustomError = require('../app/errors/CustomError');

module.exports.get = async (req, res, next) => {

    let userId = req.params.id;
    let user;
    let userLikeCount;

    try {
        user = await User.findById(userId);
    } catch (err) {
        if (err instanceof CustomError) {
            output.error(res, err.message);
        } else {
            next(err);
        }
        return;
    }

    try {
        userLikeCount = await UserLike.countById(userId);
    } catch (e) {
        output.error(e.message);
        return;
    }

    output.result(res, {
        username: user.username,
        likes: userLikeCount
    });

};

module.exports.like = async (req, res, next) => {

    let userId = req.params.id;
    try {
        console.log('Adding UserLike - user ' + req.user.data.userId + ' likes ' + userId);
        let affectedRows = await UserLike.add(new UserLike(req.user.data.userId, userId));
        console.log('Affected rows: ' + affectedRows);
    } catch (e) {
        if (e instanceof CustomError) {
            output.error(res, e.message);
        } else {
            console.log(e);
            next(e);
        }
        return;
    }

    output.result(res, {
        success: true
    });

};

module.exports.unlike = async (req, res, next) => {

    let userId = req.params.id;
    try {
        let affectedRows = await UserLike.remove(new UserLike(req.user.data.userId, userId));
        if (affectedRows === 0) {
            output.error(res, 'User was not liked');
            return;
        }
    } catch (e) {
        if (e instanceof CustomError) {
            output.error(res, e.message);
        } else {
            console.log(e);
            next(e);
        }
        return;
    }

    output.result(res, {
        success: true
    });

};