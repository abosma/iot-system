const mqtt = require('async-mqtt');
const logger = require('../../logging/winston')

require('dotenv').config();

const connectionInfo = 
{
    serverIp: process.env.MQTT_HOST + ':' + process.env.MQTT_PORT,
    clientOptions:
    {
        clientId: process.env.MQTT_CLIENTNAME,
        connectTimeout: 5000,
        clean: false
    }
}

function connectWithRetry()
{
    return new Promise(async (resolve) => {
        try {
            const connectedClient = await mqtt.connectAsync(connectionInfo.serverIp, connectionInfo.clientOptions, false);
    
            logger.debug('MQTT: Connected to server.')

            resolve(connectedClient);
        }
        catch (error) {
            logger.error('MQTT: Failed to connect to server, retrying in 5 seconds. Error: ' + error);
            setTimeout(connectWithRetry, 5000);
        }
    })
}

module.exports = 
{
    connectWithRetry
}