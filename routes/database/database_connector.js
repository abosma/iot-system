// Taken from https://node-postgres.com/guides/project-structure

const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool();

module.exports =
{
    query: async (text, params = null) =>
    {
        const statementName = await bcrypt.hash(text, 10)

        const preparedStatement = {
            name: statementName,
            text: text,
            values: params
        }

        return pool.query(preparedStatement);
    }
}