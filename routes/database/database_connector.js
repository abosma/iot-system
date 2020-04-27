// Taken from https://node-postgres.com/guides/project-structure

const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const fs = require('fs');

const key = fs.readFileSync(__dirname + '/../../certs/server.key');
const cert = fs.readFileSync(__dirname + '/../../certs/server.cert')

const config = 
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

const pool = new Pool(config);

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