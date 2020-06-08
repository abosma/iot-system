const express = require('express');
const router = express.Router();
const content_handler = require('../business/content_handler')
const passport = require('passport');

require('dotenv').config();

router.get('/', passport.authenticate('jwt', { session: false }), async function (req, res, next) {
    const contentList = await content_handler.getAllContent().catch((err) => {
        return next(new Error('Something went wrong retrieving all of the content, check the database server status and try again.'));
    });

    res.render('content', {
        contentList: contentList
    })
})

router.get('/:contentId', passport.authenticate('jwt', { session: false }), async function (req, res, next) {
    const contentId = req.params.contentId;

    const retrievedContent = await content_handler.getContentById(contentId).catch((err) => {
        return next(new Error('Something went wrong retrieving this content, check the database server status and try again.'));
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

    content_handler.createContent(contentUrl, contentType)
    .then(() => {
        res.redirect('/content');
    })
    .catch((err) => {
        return next(new Error('Something went wrong creating a new content row, please try again.'));
    });
})

router.post('/upload', passport.authenticate('jwt', { session: false }), async function (req, res, next) {
    const formRequest = req;

    content_handler.uploadContent(formRequest)
    .then(() => {
        res.redirect('/content');
    })
    .catch((err) => {
        return next(new Error('Something went wrong uploading the content. Check the database/file server status and/or if the file hasn\'t been uploaded yet.'));
    });
})

router.put('/', passport.authenticate('jwt', { session: false }), async function (req, res, next) {
    const {
        contentId,
        contentUrl,
        contentType
    } = req.body;

    content_handler.updateContent(contentUrl, contentType, contentId)
    .then(() => {
        res.redirect('/content');
    })
    .catch((err) => {
        return next(new Error('Something went wrong updating the content, please try again.'));
    });
})

router.delete('/', passport.authenticate('jwt', { session: false }), async function (req, res, next) {
    const {
        contentId,
        contentUrl
    } = req.body;

    content_handler.deleteContent(contentId, contentUrl)
    .then(() => {
        // Deleting content is done with an ajax call, thats why 200 is sent instead of redirecting to content.
        res.sendStatus(200);
    })
    .catch((err) => 
    {
        return next(new Error('Something went wrong deleting the file, check the database/file server status and try again.'));
    });
})

module.exports = router;