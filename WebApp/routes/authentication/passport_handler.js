const passport = require('passport')
const bcrypt = require('bcrypt');
const user_handler = require('../database/user_handler');
const LocalStrategy = require('passport-local').Strategy;

function intializePassport()
{
    passport.use(localPassportStrategy);

    passport.serializeUser((user, callback) => {
        callback(null, user.userId)
    })

    passport.deserializeUser((id, callback) => {
        user_handler.getUserById(id)
        .then((data) => {
            const userData = data.rows[0];
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

const localPassportStrategy = new LocalStrategy((username, password, callback) => {
    user_handler.getUserByUsername(username)
    .then((data) => {
        if(data.rowCount > 0)
        {
            const userData = data.rows[0];
            const encryptedPassword = userData.password;

            bcrypt.compare(password, encryptedPassword)
            .then((result) => {
                if(result == true)
                {
                    const returnedData = {
                        userId: userData.id,
                        username: userData.username
                    }
                    
                    return callback(null, returnedData);
                }
                else
                {
                    return callback(null, false, { message: 'Incorrect password.'} )
                }
            })
        }
        else
        {
            return callback(null, false, { message: 'User not found.'} )
        }
    })
    .catch((err) => {
        callback(err);
    })
})

module.exports = {
    intializePassport
}