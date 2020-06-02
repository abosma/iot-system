// Uses https://github.com/passport/express-4.x-local-example/blob/master/server.js as basis

const express = require('express');
const router = express.Router();
const passport = require('passport');
const user_handler = require('../business/user_handler');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

// Loads environment variables from .env file
require('dotenv').config();

router.get('/login', function(req, res) {
    res.render('login');
})

router.get('/register', function(req, res) {
    res.render('register');
})

router.post('/login', (req, res, next) => 
{
    passport.authenticate('local', {
        session: false
    }, (err, user, info) => {
        if(err || !user)
        {
            return next(new Error('User not found or database down, please try again.'));
        }

        req.login(user, (err) => {
            if(err) {
                return next(new Error('User not found, or password wrong. Please try again.'));
            }

            const jsonToken = jsonwebtoken.sign(user, process.env.HASH_SECRET);
            
            res.cookie('jwt', jsonToken,
            {
                httpOnly: true,
                secure: true,
                sameSite: true
            });

            res.redirect('/');
        })
    })(req, res);
});

router.post('/register', function(req, res, next) {
    const { username, password } = req.body;

    bcrypt.hash(password, 10)
    .then((encryptedPassword) => {
        user_handler.createUser(username, encryptedPassword)
        .then(() => {
            res.sendStatus(200);
        })
        .catch((err) => {
            return next(new Error('Something went wrong logging in, please try again.'));
        })
    })
    .catch((err) => {
        return next(new Error('Wrong password, please try again.'));
    })
})

router.get('/logout', function(req, res)
{
    req.logout();
    res.redirect('/');
})

module.exports = router;