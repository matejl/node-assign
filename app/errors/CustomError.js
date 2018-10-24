
class CustomError extends Error {

    constructor(errorMessage) {
        super();
        this.message = errorMessage;
    }
}

module.exports = CustomError;