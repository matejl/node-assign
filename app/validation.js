const CustomError = require('./errors/CustomError');

/**
 * Function paramMandatory checks whether query parameter paramName exists and has the correct type.
 * Throws an error if it does not exist or has an incorrect type.
 * @param req
 * @param paramName
 * @param wantedParamType
 * @returns {*}
 */
module.exports.paramMandatory = (req, paramName, wantedParamType) => {

    let paramValue;
    if ((req.method === 'POST' || req.method === 'PUT') && typeof req.body !== 'undefined') {
        paramValue = req.body[paramName];
    } else {
        paramValue = req.query[paramName]
    }

    let actualParamType = typeof paramValue;
    if (typeof actualParamType === 'undefined' || paramValue === '') {
        throw new CustomError('Missing param \'' + paramName + '\'');
    }
    if (typeof wantedParamType !== 'undefined' && typeof actualParamType !== wantedParamType) {
        throw new CustomError('Incorrect param type. Wanted \'' + wantedParamType + '\', got \'' + actualParamType + '\'');
    }
    return paramValue;

};