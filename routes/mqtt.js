const express = require('express');
const router = express.Router();
const mqtt_handler = require('./mqtt/mqtt_handler');

router.get('/', async function (req, res) {
    res.render('mqtt');
})

module.exports = router;