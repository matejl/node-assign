const bodyParser = require('body-parser');
const jwt = require('express-jwt');
const config = require('./config');
const output = require('./app/output');

/**
 * Registers middlewares.
 * @param app
 */
module.exports.register = (app) => {
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(jwt({secret: config.auth.jwtSecret}).unless({
        path: [
            '/login',
            '/signup',
            {url: /^\/user\/\d*$/, methods: ['GET']},
            '/most-liked'
        ]
    }));

    // handle JWT auth error
    app.use(function (err, req, res, next) {
        if (err.name === 'UnauthorizedError') {
            output.error(res.status(401), 'Invalid token');
        }
    });

    // general error handler
    app.use(function (err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        console.log(err);

        // render the error page
        res.status(err.status || 500);
        output.error(res, 'Server error');
    });
};