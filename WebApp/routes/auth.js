// Uses https://github.com/passport/express-4.x-local-example/blob/master/server.js as basis

const express = require('express');
const router = express.Router();
const passport = require('passport');
const user_handler = require('./database/user_handler');
const bcrypt = require('bcrypt');

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

router.post('/login', passport.authenticate('local', { failureRedirect: '/auth/login', failureMessage: true }), (req, res, next) => 
{
    res.redirect('/');
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