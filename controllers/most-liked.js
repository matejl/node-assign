const output = require('../app/output');
const UserLike = require('../models/userLike');

module.exports.index = async (req, res, next) => {
    let mostLiked;
    try {
        mostLiked = await UserLike.getAllMostLiked();
    } catch (err) {
        console.log(err);
        next(err);
        return;
    }
    output.result(res, mostLiked);
};