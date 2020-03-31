const db = require('./database_connector');

function getUserById(userId)
{
    return db.query('SELECT * FROM users WHERE id = $1::integer', [userId]);
}

function getUserByUsername(username)
{
    return db.query('SELECT * FROM users WHERE username = $1::varchar', [username]);
}

function createUser(username, password)
{
    return db.query('INSERT INTO users VALUES (DEFAULT, NULL, $1::varchar, $2::varchar) ON CONFLICT DO NOTHING', [username, password]);
}

module.exports = {
    getUserById,
    getUserByUsername,
    createUser
}