const database_connector = require('../data/database_connector')
const sftp_connector = require('../data/sftp_connector')
const formidable = require('formidable');
const fs = require('fs').promises;

function getContentById(contentId) {
    return new Promise((resolve, reject) => 
    {
        database_connector.query('SELECT * FROM content WHERE id = $1::integer', [contentId])
        .then((data) => {
            const toReturnContent = data.rows[0];

            if(!toReturnContent)
            {
                throw new Error('Content not found, please check if the topic has content.');
            }

            resolve(toReturnContent);
        })
        .catch((err) => {
            reject(err);
        })
    })
}

function getAllContent() {
    return new Promise((resolve, reject) => 
    {
        database_connector.query('SELECT * FROM content')
        .then((data) => {
            const toReturnContentList = data.rows;

            resolve(toReturnContentList);
        })
        .catch((err) => {
            reject(err);
        })
    })
}

function createContent(contentUrl, contentType) {
    return new Promise((resolve, reject) => 
    {
        database_connector.query('INSERT INTO content VALUES(DEFAULT, $1::varchar, $2::varchar) ON CONFLICT DO NOTHING', [contentUrl, contentType])
        .then(() => {
            resolve();
        })
        .catch((err) => {
            reject(err);
        })
    })
}

function uploadContent(formRequest)
{
    return new Promise((resolve, reject) => 
    {
        const fileParser = new formidable.IncomingForm();

        fileParser.parse(formRequest)
        .on('file', async (name, file) => {
            const contentUrl = file.path;
            const contentType = file.type;
            const externalPath = process.env.SFTP_UPLOAD_PATH + '\\' + file.name;

            var connectedClient;

            try
            {
                connectedClient = await sftp_connector.getConnectedClient();

                var fileExists = await connectedClient.exists(externalPath);

                // fileExists can be false, d (dir), - (file), or l (link).
                // https://www.npmjs.com/package/ssh2-sftp-client#org62ac504
                if(fileExists != false)
                {
                    throw new Error('File has already been uploaded, please upload something else.');
                }

                await connectedClient.fastPut(contentUrl, externalPath);

                await this.createContent(externalPath, contentType);

                resolve();
            }
            catch(err)
            {
                reject(err);
            }
            finally
            {
                await connectedClient.end();

                await fs.unlink(contentUrl);
            }
        })
        .on('error', (err) => {
            reject(err);
        })
    })
}

function deleteContent(contentId, contentUrl) {
    return new Promise(async (resolve, reject) => 
    {
        var connectedClient;

        try
        {
            connectedClient = await sftp_connector.getConnectedClient();

            var fileExists = await connectedClient.exists(contentUrl);

            // fileExists can be false, d (dir), - (file), or l (link).
            // https://www.npmjs.com/package/ssh2-sftp-client#org62ac504
            if(fileExists == '-')
            {
                await connectedClient.delete(contentUrl);
            }
            
            await database_connector.query('DELETE FROM content WHERE id = $1::integer', [contentId]);

            resolve();
        }
        catch(err)
        {
            reject(err);
        }
        finally
        {
            await connectedClient.end();
        }
    })
}

module.exports = {
    getContentById,
    getAllContent,
    createContent,
    uploadContent,
    deleteContent
}