class content_handler
{
    constructor(databaseClient)
    {
        this.client = databaseClient;
    }

    createContent(contentLink = "null")
    {
        return new Promise((resolve, reject) =>
        {
            this.client.query("INSERT INTO content VALUES(DEFAULT, $1::text) ON CONFLICT DO NOTHING RETURNING content_id", [contentLink])
            .then((contentId) =>
            {
                resolve(contentId);
            })
            .catch((error) => 
            {
                reject(error);
            })
        })
    }

    getContentLink(contentId)
    {
        return new Promise((resolve, reject) =>
        {
            this.client.query("SELECT content_link FROM content WHERE content_id = $1::integer", [contentId])
            .then((result) => resolve(result))
            .catch((error) => reject(error));
        })
    }
}

exports.content_handler = content_handler;