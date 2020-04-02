const express = require('express');
const router = express.Router();
const mqtt_handler = require('./mqtt/mqtt_handler');

router.get('/', async function (req, res) {
    res.render('mqtt');

})

router.post('/', async function (req, res) {
    const {
        topicName,
        topicMessage
    } = req.body;

    await mqtt_handler.publishMessageToTopic(topicName, topicMessage).catch((err) => {
        res.sendStatus(500);
        throw new Error(err)
    });

    res.sendStatus(200);
})

module.exports = router;