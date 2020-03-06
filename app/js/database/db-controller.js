require("dotenv").config();

const { Client } = require("pg");

const topicHandler = require("./topic-controller").topic_handler;
const qrcodeHandler = require("./qrcode-controller").qrcode_handler;
const contentHandler = require("./content-controller").content_handler;

class db_handler {
    
    client = null;
    topic_con = null;
    qrcode_con = null;
    content_con = null;

    connectToDatabase(clientOptions = null) {
        return new Promise((resolve, reject) => {
            (clientOptions == null) ? this.client = new Client() : this.client = new Client(clientOptions);

            this.client.connect()
                .then(() => {
                    this.topic_con = new topicHandler(this.client);
                    this.qrcode_con = new qrcodeHandler(this.client);
                    this.content_con = new contentHandler(this.client);
                    
                    resolve("Connected to database: " + this.client.database);
                })
                .catch((error) => {
                    reject(Error("Could not connect to database, error: " + error))
                });
        })
    }

    createTopic(topicName) {
        this.getTopicsAndOthers()
        .then((returnArray) =>
        {
            console.log(returnArray);
        });
        
        if (this.clientIsValid()) 
        {
            return new Promise((resolve, reject) =>
            {
                this.topic_con.canInsertTopic(topicName)
                .then(() => 
                {
                    Promise.all([
                        this.content_con.createContent(),
                        this.qrcode_con.createQrcode()
                    ])
                    .then(([content, qrcode]) =>
                    {
                        let qrcodeId = qrcode.rows[0].qrcode_id;
                        let contentId = content.rows[0].content_id;

                        this.topic_con.createTopic(qrcodeId, contentId, topicName)
                        .then(() =>
                        {
                            resolve();
                        });
                    })
                })
                .catch(() =>
                {
                    reject(Error("Given topic name already exists, please use another name."))
                })
            })
        }
    }

    getTopicsAndOthers()
    {
        return new Promise((resolve, reject) =>
        {
            this.topic_con.getTopicList()
            .then((resultRows) => 
            {
                resultRows.forEach(element => {
                    Promise.all([
                        this.content_con.getContentLink(element.content_id),
                        this.qrcode_con.getQrcodeUrl(element.qrcode_id)
                    ])
                    .then(([contentLinkRow, qrcodeUrlRow]) =>
                    {
                        let content_link = contentLinkRow.rows[0].content_link;
                        let qrcode_url = qrcodeUrlRow.rows[0].qrcode_url;
                        
                        toReturnObjectArray.push({
                            topicName : element.topic_name,
                            contentLink : content_link,
                            qrcodeUrl : qrcode_url
                        })
                    })
                    .catch((error) => 
                    {
                        console.log(error)
                    });
                });
            })
            .catch((error) => reject(error));
        })
    }

    clientIsValid() 
    {
        return this.client != null && this.client._connected == true;
    }

    read(queryParams) 
    {
        if (this.clientIsValid()) {
            this.client.query("SELECT $1::text FROM $2::text", [queryParams[0], queryParams[1]])
                .then((resolve) => {
                    console.log(resolve);
                })
                .catch((error) => {
                    console.log(error);
                })
        }
    }

    update(queryParams) 
    {
        if (this.clientIsValid()) {
            this.client.query("UPDATE $1::text SET $2::text = $4::text WHERE $2::text = $3::text)", [queryParams[0], queryParams[1], queryParams[2], queryParams[3]])
                .then((resolve) => {
                    console.log(resolve);
                })
                .catch((error) => {
                    console.log(error);
                })
        }
    }

    delete(parameters) 
    {
        if (this.clientIsValid()) {
            this.client.query("DELETE FROM $1::text WHERE $1::text.id = $3::text)", [queryParams[0], queryParams[1], queryParams[2]])
                .then((resolve) => {
                    console.log(resolve);
                })
                .catch((error) => {
                    console.log(error);
                })
        }
    }
}

exports.db_handler = db_handler;