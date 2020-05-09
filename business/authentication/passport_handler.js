const passport = require('passport')
const bcrypt = require('bcrypt');
const user_handler = require('../../data/user_handler');
const passportJWT = require('passport-jwt');
const extractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = passportJWT.Strategy;

// Loads environment variables from .env file
require('dotenv').config();

const cookieExtractor = function(req) {
    var token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];
    }
    return token;
};

function intializePassport() {
    passport.use(localPassportStrategy);
    passport.use(jwtPassportStrategy);

    passport.serializeUser((user, callback) => {
        callback(null, user.userId)
    })

    passport.deserializeUser((id, callback) => {
        user_handler.getUserById(id)
            .then((userData) => {
                const returnedData = {
                    userId: userData.id,
                    username: userData.username
                }

                callback(null, returnedData);
            })
            .catch((err) => {
                callback(err);
            })
    })
}

const localPassportStrategy = new LocalStrategy(async (username, password, callback) => {
    try {
        const userData = await user_handler.getUserByUsername(username);

        if (userData) {
            const encryptedPassword = userData.password;

            const comparisonResult = await bcrypt.compare(password, encryptedPassword);

            if (comparisonResult === true) {
                const returnedData = {
                    userId: userData.id,
                    username: userData.username
                }

                return callback(null, returnedData);
            } else {
                return callback(null, false, {
                    message: 'Incorrect password.'
                })
            }
        } else {
            return callback(null, false, {
                message: 'User not found.'
            })
        }
    } catch (err) {
        callback(err);
    }
})

const jwtPassportStrategy = new JWTStrategy({
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.HASH_SECRET
}, async (jwtPayload, callback) => {
    try {
        const userId = jwtPayload.userId;
        const userData = await user_handler.getUserById(userId);

        if (userData) {
            const returnedData = {
                userId: userData.id,
                username: userData.username
            }

            return callback(null, returnedData);
        } else {
            return callback(null, false, {
                message: 'User not found.'
            })
        }
    } catch (err) {
        callback(err);
    }
})

module.exports = {
    intializePassport
}