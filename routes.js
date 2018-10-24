/**
 * Created by matej on 20/10/2018.
 */

const loginRouter = require('./routes/login');
const meRouter = require('./routes/me');
const mostLikedRouter = require('./routes/most-liked');
const signupRouter = require('./routes/signup');
const userRouter = require('./routes/user');

exports.register = function(app) {
    app.use('/login', loginRouter);
    app.use('/me', meRouter);
    app.use('/most-liked', mostLikedRouter);
    app.use('/signup', signupRouter);
    app.use('/user', userRouter);
};