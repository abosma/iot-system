const topic_handler = require('../database/topic_handler')
const content_handler = require('../database/content_handler')
const logger = require('../../logging/winston')
const mqtt = require('async-mqtt');

require('dotenv').config();

// Separate the connection code from handler code
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

var client = null;

async function connectWithRetry()
{
    try {
        const connectedClient = await mqtt.connectAsync(connectionInfo.serverIp, connectionInfo.clientOptions, false);

        client = connectedClient;

        logger.debug('MQTT: Connected to server.')

        initializeMessageHandler(connectedClient);

        checkIfConnected();
    }
    catch (error) {
        logger.error('MQTT: Failed to connect to server, retrying in 5 seconds. Error: ' + error);
        setTimeout(connectWithRetry, 5000);
    }
}

function initializeMessageHandler(client)
{
    client.on('message', async function (topic, message) {
        const messageObject = JSON.parse(message);
    
        if (messageObject.client != 'System') {
            const topicData = await topic_handler.getTopicByName(topic).catch((err) => logger.error(err));
            const contentData = await content_handler.getContentById(topicData.content_id).catch((err) => logger.error(err));
    
            const toReturnContentData = {
                client: 'System',
                
                message: '200',

                contentUrl: contentData.content_url,
                contentType: contentData.content_type
            }
    
            var returnMessage = JSON.stringify(toReturnContentData);
    
            await client.publish(topic, returnMessage).catch((err) => logger.error(err));
        }
    })

    logger.debug('MQTT: Initialized message handler.');
}

function checkIfConnected()
{
    if(!client || client.connected == false && client.reconnecting == false)
    {
        logger.error("Lost connection to MQTT server, retrying.")
        connectWithRetry();
    }
    else
    {
        setTimeout(checkIfConnected, 10000);
    }
}

connectWithRetry();
// Separate the connection code from handler code

function subscribeToTopic(topic) {
    return new Promise((resolve, reject) => {
        client.subscribe(topic)
        .then(() => {
            resolve();
        })
        .catch((err) => {
            reject(err);
        });
    });
}

function unsubscribeToTopic(topic) {
    return new Promise((resolve, reject) => {
        client.unsubscribe(topic)
        .then(() => {
            resolve();
        })
        .catch((err) => {
            reject(err);
        });
    });
}

function publishMessageToTopic(topic, message) {
    return new Promise((resolve, reject) => {
        client.publish(topic, message)
        .then(() => {
            resolve();
        })
        .catch((err) => {
            reject(err);
        });
    });
}

function disconnectClient() {
    return new Promise((resolve, reject) => {
        client.end()
        .then(() => {
            resolve();
        })
        .catch((err) => {
            reject(err);
        });
    });
}

module.exports = {
    subscribeToTopic,
    unsubscribeToTopic,
    publishMessageToTopic,
    disconnectClient
}