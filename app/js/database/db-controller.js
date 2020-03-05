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

    createTopic(topicName)
    {
        if(this.clientIsValid())
        {
            if(!this.topicExists(topicName))
            {
                this.client.query("INSERT INTO content VALUES(DEFAULT, null) ON CONFLICT DO NOTHING RETURNING content_id")
                .then((result_content) =>
                {
                    var content_id = result_content.rows[0].content_id;

                    this.client.query("INSERT INTO qrcode VALUES(DEFAULT, null) ON CONFLICT DO NOTHING RETURNING qrcode_id")
                    .then((result_qrcode) =>
                    {
                        var qrcode_id = result_qrcode.rows[0].qrcode_id;
                        
                        this.client.query("INSERT INTO topic VALUES(DEFAULT, $1::integer, $2::integer, $3::text) ON CONFLICT DO NOTHING", [qrcode_id, content_id, topicName])
                        .then((resolve) =>
                        {
                            console.log(resolve);
                        })
                        .catch((error) => 
                        {
                            console.log(error);
                        })
                    })
                    .catch((error) => 
                    {
                        console.log(error);
                    })
                })
                .catch((error) => 
                {
                    console.log(error);
                })
            }
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
        return this.client != null && this.client._connected == true;
    }

    topicExists(topicName)
    {
        if(this.clientIsValid)
        {
            this.client.query("SELECT topic_name FROM topic WHERE topic_name = $1::text", topicName)
            .then((topic_exists) =>
            {
                console.log(topic_exists);
                return true;
            })
            .catch((topic_doesnt_exist) =>
            {
                console.log(topic_doesnt_exist);
                return false;
            })
        }
    }
}

exports.db_handler = db_handler;