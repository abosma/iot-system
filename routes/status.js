const express = require('express');
const router = express.Router();
const mqtt_handler = require('./mqtt/mqtt_handler');
const db = require('./database/database_connector');

router.get('/', async function (req, res) {
    res.render('status', 
    {
        mqttStatus: mqtt_handler.getConnectionStatus(),
        databaseStatus: db.getConnectionStatus()
    });
})

module.exports = router;