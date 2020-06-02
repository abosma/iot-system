const express = require('express');
const router = express.Router();
const content_handler = require('../business/content_handler')
const passport = require('passport');

require('dotenv').config();

router.get('/', passport.authenticate('jwt', { session: false }), async function (req, res, next) {
    const contentList = await content_handler.getAllContent().catch((err) => {
        return next(new Error('Something went wrong retrieving all of the content, please try again.'));
    });

    res.render('content', {
        contentList: contentList
    })
})

router.get('/:contentId', passport.authenticate('jwt', { session: false }), async function (req, res, next) {
    const contentId = req.params.contentId;

    const retrievedContent = await content_handler.getContentById(contentId).catch((err) => {
        return next(new Error('Something went wrong retrieving this content, please try again.'));
    });

    res.send({
        contentId: retrievedContent.id,
        contentUrl: retrievedContent.content_url,
        contentType: retrievedContent.content_type
    });
})

router.post('/', passport.authenticate('jwt', { session: false }), async function (req, res, next) {
    const {
        contentUrl,
        contentType
    } = req.body;

    await content_handler.createContent(contentUrl, contentType).catch((err) => {
        return next(new Error('Something went wrong creating a new content row, please try again.'));
    });

    res.redirect('/content');
})

router.post('/upload', passport.authenticate('jwt', { session: false }), async function (req, res, next) {
    const formRequest = req;
    
    await content_handler.uploadContent(formRequest).catch((err) => {
        return next(new Error('Something went wrong uploading the content, check the file server status and try again.'));
    })

    res.sendStatus(200);
})

router.put('/', passport.authenticate('jwt', { session: false }), async function (req, res, next) {
    const {
        contentId,
        contentUrl,
        contentType
    } = req.body;

    await content_handler.updateContent(contentUrl, contentType, contentId).catch((err) => {
        return next(new Error('Something went wrong updating the content, please try again.'));
    });

    res.sendStatus(200);
})

router.delete('/', passport.authenticate('jwt', { session: false }), async function (req, res, next) {
    const {
        contentId,
        contentUrl
    } = req.body;

    try {
        await sftp_client.delete(contentUrl);
        await content_handler.deleteContent(contentId)
    } catch(err) {
        return next(new Error('Something went wrong deleting the file, please try again.'));
    }

    res.sendStatus(200);
})

module.exports = router;