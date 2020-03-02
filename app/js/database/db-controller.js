require("dotenv").config();

const { Client } = require("pg");

class db_handler {
    client = null;

    connectToDatabase(clientOptions = null) {
        return new Promise((resolve, reject) => {
            (clientOptions == null) ? this.client = new Client() : this.client = new Client(clientOptions);

            this.client.connect()
                .then(() => {
                    resolve("Connected to database: " + this.client.database);
                })
                .catch((error) => {
                    reject(Error("Could not connect to database, error: " + error))
                });
        })
    }

    create(queryParams)
    {
        if(this.clientIsValid())
        {
            this.client.query("INSERT INTO $1::text VALUES($2::text, $3::text)", [queryParams[0], queryParams[1], queryParams[2]])
            .then((resolve) =>
            {
                console.log(resolve);
            })
            .catch((error) => 
            {
                console.log(error);
            })
        }
    }

    read(queryParams)
    {
        if(this.clientIsValid())
        {
            this.client.query("SELECT $1::text FROM $2::text", [queryParams[0], queryParams[1]])
            .then((resolve) =>
            {
                console.log(resolve);
            })
            .catch((error) => 
            {
                console.log(error);
            })
        }
    }

    update(queryParams)
    {
        if(this.clientIsValid())
        {
            this.client.query("UPDATE $1::text SET $2::text = $4::text WHERE $2::text = $3::text)", [queryParams[0], queryParams[1], queryParams[2], queryParams[3]])
            .then((resolve) =>
            {
                console.log(resolve);
            })
            .catch((error) => 
            {
                console.log(error);
            })
        }
    }

    delete(parameters)
    {
        if(this.clientIsValid())
        {
            this.client.query("DELETE FROM $1::text WHERE $1::text.id = $3::text)", [queryParams[0], queryParams[1], queryParams[2]])
            .then((resolve) =>
            {
                console.log(resolve);
            })
            .catch((error) => 
            {
                console.log(error);
            })
        }
    }

    clientIsValid()
    {
        return this.client != null && this.client.connected == true;
    }
}

exports.db_handler = db_handler;