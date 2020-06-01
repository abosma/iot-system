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
    res.render('login', 
    {
        error: req.session.messages
    });
})

router.get('/register', function(req, res) {
    res.render('register',
    {
        error: req.session.messages
    })
})

router.post('/login', (req, res, next) => 
{
    passport.authenticate('local', {
        session: false
    }, (err, user, info) => {
        if(err || !user)
        {
            res.sendStatus(500);
            throw new Error(err);
        }

        req.login(user, (err) => {
            if(err) {
                res.sendStatus(500);
                throw new Error(err);
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

router.post('/register', function(req, res) {
    const { username, password } = req.body;

    bcrypt.hash(password, 10)
    .then((encryptedPassword) => {
        user_handler.createUser(username, encryptedPassword)
        .then(() => {
            res.sendStatus(200);
        })
        .catch((err) => {
            throw new Error(err);
        })
    })
    .catch((err) => {
        throw new Error(err);
    })
})

router.get('/logout', function(req, res)
{
    req.logout();
    res.redirect('/');
})

module.exports = router;