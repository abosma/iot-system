const express = require('express');
const router = express.Router();
const topic_handler = require('../business/topic_handler');
const content_handler = require('../business/content_handler');
const mqtt_handler = require('../business/mqtt_handler');
const passport = require('passport');

router.get('/', passport.authenticate('jwt', { session: false }), async function (req, res, next) {
    const topicList = await topic_handler.getTopics().catch((err) => {
        return next(new Error('Something went wrong retrieving all topics, please try again.'));
    })

    const contentList = await content_handler.getAllContent().catch((err) => {
        return next(new Error('Something went wrong retrieving all content, please try again.'))
    })

    res.render('topics', {
        topicList: topicList,
        contentList: contentList
    })
})

router.get('/:topicId', passport.authenticate('jwt', { session: false }), async function (req, res, next) {
    const topicId = req.params.topicId;

    const retrievedTopic = await topic_handler.getTopicById(topicId).catch((err) => {
        return next(new Error('Something went wrong retrieving this topic, please try again.'));
    });

    const retrievedContent = await content_handler.getContentById(retrievedTopic.content_id).catch((err) => {
        return next(new Error('Something went wrong retrieving this topic, please try again.'));
    });

    res.send({
        topicId: topicId,
        topicName: retrievedTopic.topic_name,
        contentId: retrievedTopic.content_id,
        contentUrl: retrievedContent ? retrievedContent.content_url : null
    })
})

router.post('/', passport.authenticate('jwt', { session: false }), async function (req, res, next) {
    const {
        topicName
    } = req.body;

    try {
        await mqtt_handler.subscribeToTopic(topicName);
        await topic_handler.createTopic(topicName);
    } catch (err) {
        return next(new Error('Something went wrong creating a new topic, please try again.'));
    }

    res.redirect('/topics');
})

router.put('/', passport.authenticate('jwt', { session: false }), async function (req, res, next) {
    const {
        topicId,
        topicName,
        contentId
    } = req.body;

    try {
        await mqtt_handler.unsubscribeToTopic(topicName);
        await mqtt_handler.subscribeToTopic(topicName);

        await topic_handler.updateTopic(topicName, contentId, topicId);
    } catch (err) {
        return next(new Error('Something went wrong updating this topic, please try again.'));
    }

    res.sendStatus(200);
})

router.delete('/', passport.authenticate('jwt', { session: false }), async function (req, res, next) {
    const {
        topicId,
        topicName
    } = req.body;

    try {
        await mqtt_handler.unsubscribeToTopic(topicName);
        await topic_handler.deleteTopic(topicId);
    } catch (err) {
        return next(new Error('Something went wrong deleting this topic, please try again.'));
    }

    res.sendStatus(200);
})

module.exports = router;