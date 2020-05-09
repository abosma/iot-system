const express = require('express');
const router = express.Router();
const mqtt_handler = require('../business/mqtt/mqtt_handler');
const db = require('../data/database_connector');

router.get('/', async function (req, res) {
    var databaseStatus = await db.getConnectionStatus();
    var mqttStatus = mqtt_handler.getConnectionStatus();

    res.render('status', 
    {
        mqttStatus,
        databaseStatus
    });
})

module.exports = router;