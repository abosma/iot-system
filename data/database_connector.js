// Taken from https://node-postgres.com/guides/project-structure

const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const fs = require('fs');

const key = fs.readFileSync(__dirname + '/../certs/server.key');
const cert = fs.readFileSync(__dirname + '/../certs/server.cert')

const db_connection_config = 
{
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    ssl :
    {
        rejectUnauthorized: false,
        key,
        cert
    }
}

const pool = new Pool(db_connection_config);

// Prepared Statement gets an encrypted name. If the text is the same, the name is the same.
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
    // It resolves false instead of rejecting, this is so routes/status.js can easily render the status
    return new Promise((resolve, reject) => {
        pool.query('SELECT NOW()')
        .then(res => {
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