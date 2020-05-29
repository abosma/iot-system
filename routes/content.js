const express = require('express');
const router = express.Router();
const content_handler = require('../business/content_handler')
const passport = require('passport');

require('dotenv').config();

router.get('/', passport.authenticate('jwt', { session: false }), async function (req, res) {
    const contentList = await content_handler.getAllContent().catch((err) => {
        res.sendStatus('500');
        throw new Error(err)
    });

    res.render('content', {
        contentList: contentList
    })
})

router.get('/:contentId', passport.authenticate('jwt', { session: false }), async function (req, res) {
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

router.post('/', passport.authenticate('jwt', { session: false }), async function (req, res) {
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

router.post('/upload', passport.authenticate('jwt', { session: false }), async function (req, res) {
    await content_handler.uploadContent(req).catch((err) => {
        res.sendStatus(500);
        throw new Error(err);
    })

    res.sendStatus(200);
})

router.put('/', passport.authenticate('jwt', { session: false }), async function (req, res) {
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

router.delete('/', passport.authenticate('jwt', { session: false }), async function (req, res) {
    const {
        contentId,
        contentUrl
    } = req.body;

    await sftp_client.delete(contentUrl);

    await content_handler.deleteContent(contentId).catch((err) => {
        res.sendStatus(500);
        throw new Error(err)
    });

    res.sendStatus(200);
})

module.exports = router;