const express = require('express');
const router = express.Router();
const mqtt_connector = require('../data/mqtt_connector');
const database_connector = require('../data/database_connector');
const sftp_connector = require('../data/sftp_connector');

router.get('/', async function (req, res) {
    var databaseStatus = await database_connector.getConnectionStatus();
    var sftpStatus = await sftp_connector.getConnectionStatus();
    var mqttStatus = mqtt_connector.getConnectionStatus();

    res.render('status', 
    {
        databaseStatus,
        sftpStatus,
        mqttStatus
    });
})

module.exports = router;