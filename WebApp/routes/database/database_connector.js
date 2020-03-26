// Taken from https://node-postgres.com/guides/project-structure

const { Pool } = require('pg');

const pool = new Pool();

module.exports =
{
    query: (text, params = null) =>
    {
        return pool.query(text, params);
    }
}