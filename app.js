const createError = require('http-errors');
const express = require('express');

const routes = require('./routes');
const middlewares = require('./middlewares');

const app = express();

middlewares.register(app);
routes.register(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

module.exports = app;