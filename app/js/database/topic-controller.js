class topic_handler
{
    constructor(databaseClient)
    {
        this.client = databaseClient;
    }

    createTopic(qrcodeId, contentId, topicName)
    {
        return new Promise((resolve, reject) => 
        {
            this.client.query("INSERT INTO topic VALUES(DEFAULT, $1::integer, $2::integer, $3::text) ON CONFLICT DO NOTHING", [qrcodeId, contentId, topicName])
            .then((success) =>
            {
                resolve(success);
            })
            .catch((error) =>
            {
                reject(error);
            })
        })
    }

    canInsertTopic(topicName)
    {
        return new Promise((resolve, reject) => 
        {
            this.client.query("SELECT topic_name FROM topic WHERE topic_name = $1::text", [topicName])
            .then((result) => {
                if(result.rows.length == 0)
                {
                    resolve();
                }
                else
                {
                    reject();
                }
            })
        })
    }

    getTopicList()
    {
        return new Promise((resolve, reject) =>
        {
            this.client.query("SELECT topic_name, qrcode_id, content_id FROM topic")
            .then((result) =>
            {
                let toReturnRows = [];

                result.rows.forEach(row => {
                    toReturnRows.push(row);
                });

                resolve(toReturnRows);
            })
            .catch((error) => console.log(error));
        })
    }
}

exports.topic_handler = topic_handler;