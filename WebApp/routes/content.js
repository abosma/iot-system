const express = require('express');
const router = express.Router();
const formidable = require('formidable');
const content_handler = require('./database/async_content_handler')

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

            await content_handler.createContent(contentUrl, contentType).catch(err => {
                res.sendStatus(500);
                throw new Error(err)
            });

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
        contentId
    } = req.body;

    await content_handler.deleteContent(contentId).catch((err) => {
        res.sendStatus(500);
        throw new Error(err)
    });

    res.sendStatus(200);
})

module.exports = router;