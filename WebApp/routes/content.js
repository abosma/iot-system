const express = require('express');
const router = express.Router();
const formidable = require('formidable');
const content_handler = require('./database/content_handler')

router.get('/', async function (req, res) {
    content_handler.getAllContent()
    .then(data => {
        res.render('content', {
            contentList: data.rows
        })
    })
    .catch(err => {
        throw new Error(err);
    })
})

router.get('/:contentId', async function (req, res) {
    let contentId = req.params.contentId;

    content_handler.getContent(contentId)
    .then(data => {
        const { id, content_url, content_type } = data.rows[0];

        res.send(
            {
                contentId: id,
                contentUrl: content_url,
                contentType: content_type
            }
        )
    }).catch(err => {
        throw new Error(err);
    })
})

router.post('/', async function (req, res) {
    const { contentUrl, contentType } = req.body;

    content_handler.createContent(contentUrl, contentType)
    .then(() => {
        res.redirect('/content');
    })
    .catch(err => {
        throw new Error(err);
    })
})

router.post('/upload', async function (req, res) {
    const fileParser = new formidable.IncomingForm();

    fileParser.parse(req)
    .on('fileBegin', (name, file) => {
        file.path = __dirname + '/uploads/' + file.name;
    })
    .on('file', (name, file) => {
        const contentUrl = file.path;
        const contentType = file.type;

        content_handler.createContent(contentUrl, contentType)
        .then(() => {
            res.redirect('/content')
        })
        .catch(err => {
            throw new Error(err);
        })
    })
    .on('error', (err) => {
        throw new Error(err);
    })
})

router.put('/', async function (req, res) {
    const { contentId, contentUrl, contentType } = req.body;

    content_handler.updateContent(contentUrl, contentType, contentId)
    .then(() =>{
        res.sendStatus(200);
    })
    .catch(err => {
        throw new Error(err);
    });
})

router.delete('/', async function (req, res) {
    const { contentId } = req.body;

    content_handler.deleteContent(contentId)
    .then(() => {
        res.sendStatus(200);
    })
    .catch(err => {
        throw new Error(err);
    })
})

module.exports = router;