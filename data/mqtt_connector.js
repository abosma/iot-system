const mqtt = require('async-mqtt');
const logger = require('../logging/winston')
const topic_handler = require('../business/topic_handler')
const content_handler = require('../business/content_handler')
const fs = require('fs');

const key = fs.readFileSync(__dirname + '/../certs/mqtt_srv.key');
const cert = fs.readFileSync(__dirname + '/../certs/mqtt_srv.cert');
const ca = fs.readFileSync(__dirname + '/../certs/mqtt_ca.cert');

require('dotenv').config();

const mqtt_connection_config = 
{
    serverIp: process.env.MQTT_HOST + ':' + process.env.MQTT_PORT,
    clientOptions:
    {
        clientId: process.env.MQTT_CLIENTNAME,
        protocol: 'mqtts',
        protocolId: 'MQTT',
        ca,
        key,
        cert,
        connectTimeout: 5000,
        clean: false,
        rejectUnauthorized: false
    }
}

var client = mqtt.connect(mqtt_connection_config.serverIp, mqtt_connection_config.clientOptions);

client.on('connect', () => {
    logger.debug('MQTT: Connected to server.');

    initializeMessageHandler();
})

client.on('reconnect', () => {
    logger.debug('MQTT: Disconnected or not yet connected to the server, (re)connecting...');
})

client.on('error', (err) => {
    logger.error(`MQTT: Error trying to connect to the server, Error: ${err}`);
})

function initializeMessageHandler()
{
    client.on('message', async function (topic, message) {
        var messageObject;

        try
        {
            messageObject = JSON.parse(message);
        }
        catch(err)
        {
            return;
        }

        if (!messageIsFromSystem(messageObject.client)) {
            try
            {
                const topicData = await topic_handler.getTopicByName(topic);
                const contentData = await content_handler.getContentById(topicData.content_id);
                const returnMessage = createContentMessage(contentData);
                
                await client.publish(topic, returnMessage);
            }
            catch(err)
            {
                const returnMessage = createErrorMessage();

                await client.publish(topic, returnMessage);

                logger.error(err.message);
            }
        }
    })

    logger.debug('MQTT: Initialized message handler.');
}

function createContentMessage(contentData)
{
    var toReturnContentData = {
        client: 'System',
        code: '200',
        message: 'Content found',
        contentUrl: contentData.content_url,
        contentType: contentData.content_type
    }

    var toReturnJsonString = JSON.stringify(toReturnContentData);

    return toReturnJsonString;
}

function createErrorMessage()
{
    var toReturnErrorMessage = {
        client: 'System',
        code: '500',
        message: 'Content not found'
    }

    var toReturnJsonString = JSON.stringify(toReturnErrorMessage);

    return toReturnJsonString;
}

function messageIsFromSystem(clientString)
{
    return clientString != null && clientString == 'System';
}

function getConnectionStatus()
{
    return client != null && client.connected;
}

module.exports = 
{
    client,
    getConnectionStatus
}