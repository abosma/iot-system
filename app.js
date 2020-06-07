const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const winston = require('./logging/winston');
const expressSession = require('express-session');
const passport = require('passport');
const passport_handler = require('./authentication/passport_handler');

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
	cookie: {
		path: '/',
		httpOnly: true,
		secure: true,
		maxAge: null,
		sameSite: true
	},
	resave: false,
	saveUninitialized: false
}

app.use(expressSession(expressSessionOptions));

app.use(passport.initialize());
app.use(passport.session());
passport_handler.intializePassport();

app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
	res.locals.isAuthenticated = req.isAuthenticated();
	
	// Used for toast notifications. Exposes flash information from request to response for view engine rendering.
	res.locals.sessionFlash = req.session.sessionFlash;
	delete req.session.sessionFlash;
	
	next();
})

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/topics', topicRouter);
app.use('/content', contentRouter);
app.use('/status', statusRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// Custom Error Handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// Writes the error message + stacktrace in both the console and log file. Users only get the error message.
	winston.error(`${err.status || 500} - ${err.stack} - ${req.originalUrl} - ${req.method} - ${req.ip}`)

	req.session.sessionFlash = 
	{
		type: 'Error',
		message: err.message
	}

	res.redirect('back');
});

module.exports = app;