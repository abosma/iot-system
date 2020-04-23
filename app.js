const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const winston = require('./logging/winston');
const expressSession = require('express-session');
const passport = require('passport');
const passport_handler = require('./routes/authentication/passport_handler');

const indexRouter = require('./routes/index');
const topicRouter = require('./routes/topics');
const contentRouter = require('./routes/content');
const authRouter = require('./routes/auth');
const statusRouter = require('./routes/status');

// Loads environment variables from .env file
require('dotenv').config();

var app = express();

app.use(morgan('combined', {
	stream: winston.stream
}));

app.use(express.json());

app.use(express.urlencoded({
	extended: true
}));

app.use(cookieParser());

const expressSessionOptions = {
	secret: process.env.HASH_SECRET,
	cookie: {},
	resave: false,
	saveUninitialized: false
}

if (app.get('env') === 'production') {
	expressSessionOptions.cookie.secure = true;
}

app.use(expressSession(expressSessionOptions))

app.use(passport.initialize());
app.use(passport.session());
passport_handler.intializePassport();

app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
	res.locals.isAuthenticated = req.isAuthenticated();
	next();
})

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/topics', topicRouter);
app.use('/content', contentRouter);
app.use('/status', statusRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`)

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;