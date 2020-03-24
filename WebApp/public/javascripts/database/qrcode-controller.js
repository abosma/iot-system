class qrcode_handler
{
    constructor(databaseClient)
    {
        this.client = databaseClient;
    }

    createQrcode(qrcodeUrl = "null")
    {
        return new Promise((resolve, reject) =>
        {
            this.client.query("INSERT INTO qrcode VALUES(DEFAULT, $1::text) ON CONFLICT DO NOTHING RETURNING qrcode_id", [qrcodeUrl])
            .then((qrcodeId) =>
            {
                resolve(qrcodeId);
            })
            .catch((error) => 
            {
                reject(error);
            })
        })
    }

    getQrcodeUrl(qrcodeId)
    {
        return new Promise((resolve, reject) =>
        {
            this.client.query("SELECT qrcode_url FROM qrcode WHERE qrcode_id = $1::integer", [qrcodeId])
            .then((result) => resolve(result))
            .catch((error) => reject(error));
        })
    }
}

exports.qrcode_handler = qrcode_handler;