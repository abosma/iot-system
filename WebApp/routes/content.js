const express = require('express');
const router = express.Router();
const formidable = require('formidable');
const fs = require('fs');
const sftp = require('ssh2-sftp-client');
const content_handler = require('./database/async_content_handler')

require('dotenv').config();

const sftp_config = {
    host: process.env.SFTP_HOST,
    port: 22,
    username: process.env.SFTP_USERNAME,
    password: process.env.SFTP_PASSWORD
}

const sftp_client = new sftp();

router.get('/', async function (req, res) {
    const contentList = await content_handler.getAllContent().catch((err) => {
        res.sendStatus('500');
        throw new Error(err)
    });

    res.render('content', {
        contentList: contentList
    })
})

router.get('/:contentId', async function (req, res) {
    const contentId = req.params.contentId;

    const retrievedContent = await content_handler.getContentById(contentId).catch((err) => {
        res.sendStatus(500);
        throw new Error(err)
    });

    res.send({
        contentId: retrievedContent.id,
        contentUrl: retrievedContent.content_url,
        contentType: retrievedContent.content_type
    });
})

router.post('/', async function (req, res) {
    const {
        contentUrl,
        contentType
    } = req.body;

    await content_handler.createContent(contentUrl, contentType).catch((err) => {
        res.sendStatus(500);
        throw new Error(err)
    });

    res.redirect('/content');
})

router.post('/upload', async function (req, res) {
    const fileParser = new formidable.IncomingForm();

    fileParser.parse(req)
        .on('fileBegin', (name, file) => {
            file.path = __dirname + '/uploads/' + file.name;
        })
        .on('file', async (name, file) => {
            const contentUrl = file.path;
            const contentType = file.type;
            const externalPath = process.env.SFTP_UPLOAD_PATH + '\\' + file.name;

            await sftp_client.connect(sftp_config).catch((err) => {
                res.sendStatus(500);
                throw new Error(err);
            });

            await sftp_client.fastPut(contentUrl, externalPath).catch((err) => {
                res.sendStatus(500);
                throw new Error(err);
            });

            await content_handler.createContent(externalPath, contentType).catch(err => {
                res.sendStatus(500);
                throw new Error(err)
            });

            fs.unlink(contentUrl);

            res.redirect('/content');
        })
        .on('error', (err) => {
            throw new Error(err);
        })
})

router.put('/', async function (req, res) {
    const {
        contentId,
        contentUrl,
        contentType
    } = req.body;

    await content_handler.updateContent(contentUrl, contentType, contentId).catch((err) => {
        res.sendStatus(500);
        throw new Error(err)
    });

    res.sendStatus(200);
})

router.delete('/', async function (req, res) {
    const {
        contentId,
        contentUrl
    } = req.body;

    await sftp_client.delete(contentUrl).catch((err) => {
        // Has a weird bug causing it to try and delete for one extra tick after deleting file, throwing an error.
        continue;
    })

    await content_handler.deleteContent(contentId).catch((err) => {
        res.sendStatus(500);
        throw new Error(err)
    });

    res.sendStatus(200);
})

module.exports = router;