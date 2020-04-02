const express = require('express');
const router = express.Router();
const topic_handler = require('./database/async_topic_handler')
const mqtt_handler = require('./mqtt/mqtt_handler');

router.get('/', async function (req, res) {
    const topicList = await topic_handler.getTopics().catch((err) => {
        res.sendStatus(500);
        throw new Error(err)
    })

    res.render('topics', {
        topicList: topicList
    })
})

router.get('/:topicId', async function (req, res) {
    const topicId = req.params.topicId;

    const retrievedTopic = await topic_handler.getTopicById(topicId).catch((err) => {
        res.sendStatus(500);
        throw new Error(err)
    });

    res.send({
        topicName: retrievedTopic.topic_name,
        contentId: retrievedTopic.content_id
    })
})

router.post('/', async function (req, res) {
    const {
        topicName
    } = req.body;

    try {
        await mqtt_handler.subscribeToTopic(topicName);
        await topic_handler.createTopic(topicName);
    } catch (err) {
        throw new Error(err);
    }

    res.redirect('/topics');
})

router.put('/', async function (req, res) {
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
        res.sendStatus(500);
        throw new Error(err);
    }

    res.sendStatus(200);
})

router.delete('/', async function (req, res) {
    const {
        topicId,
        topicName
    } = req.body;

    try {
        await mqtt_handler.unsubscribeToTopic(topicName);
        await topic_handler.deleteTopic(topicId);
    } catch (err) {
        res.sendStatus(500);
        throw new Error(err);
    }

    res.sendStatus(200);
})

module.exports = router;