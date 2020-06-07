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
            .on('fileBegin', async (name, file) => {
                var uploadFolder = __dirname + '/uploads/';
                var expectedTempFileLocation = uploadFolder + file.name;

                // If folder doesn't exist, create folder
                await fs.stat(uploadFolder)
                .catch(async (err) => 
                    await fs.mkdir(uploadFolder)
                );

                file.path = expectedTempFileLocation;
            })
            .on('file', async (name, file) => {
                const contentUrl = file.path;
                const contentType = file.type;
                const externalPath = process.env.SFTP_UPLOAD_PATH + '\\' + file.name;

                try {
                    var connectedClient = await sftp_connector.getConnectedClient();

                    await connectedClient.fastPut(contentUrl, externalPath);

                    await this.createContent(externalPath, contentType);

                    await connectedClient.end();

                    resolve();
                } catch(err) {
                    reject(err);
                }

                fs.unlink(contentUrl)
                .then(() => {
                    resolve();
                })
                .catch((err) => reject(err));
            })
            .on('error', (err) => {
                reject(err);
            })
    })
}

function deleteContent(contentId, contentUrl) {
    return new Promise(async (resolve, reject) => 
    {
        try
        {
            var connectedClient = await sftp_connector.getConnectedClient();

            await connectedClient.delete(contentUrl);
            await database_connector.query('DELETE FROM content WHERE id = $1::integer', [contentId]);

            resolve();
        }
        catch(err)
        {
            reject(err);
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