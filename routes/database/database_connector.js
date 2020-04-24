// Taken from https://node-postgres.com/guides/project-structure

const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool();

async function query(text, params = null)
{
    const statementName = await bcrypt.hash(text, 10)

    const preparedStatement = {
        name: statementName,
        text: text,
        values: params
    }

    return pool.query(preparedStatement);
}

function getConnectionStatus()
{
    return new Promise((resolve, reject) => {
        pool.connect()
        .then(client => {
            client.release();
            resolve(true);
        })
        .catch(error => {
            resolve(false);
        })
    })
}

module.exports =
{
    query,
    getConnectionStatus
}