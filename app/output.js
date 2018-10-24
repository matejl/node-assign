
module.exports.result = (res, obj) => {
    res.json(obj);
};

module.exports.error = (res, errMsg) => {
    res.json({
        error: true,
        msg: errMsg
    })
};

module.exports.errorMissingParam = (res, paramName) => {
    module.exports.error(res, 'missing param ' + paramName);
};