const db = require('./database_connector');

function getUserById(userId)
{
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM users WHERE id = $1::integer', [userId])
        .then((data) => {
            const userData = data.rows[0];

            resolve(userData);
        })
        .catch((err) => {
            reject(err);
        })
    })
}

function getUserByUsername(username)
{
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM users WHERE username = $1::varchar', [username])
        .then((data) => {
            const userData = data.rows[0];

            resolve(userData);
        })
        .catch((err) => {
            reject(err);
        })
    })
}

function createUser(username, password)
{
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO users VALUES (DEFAULT, NULL, $1::varchar, $2::varchar) ON CONFLICT DO NOTHING', [username, password])
        .then(() => {
            resolve();
        })
        .catch((err) => {
            reject(err);
        })
    })
}

module.exports = {
    getUserById,
    getUserByUsername,
    createUser
}