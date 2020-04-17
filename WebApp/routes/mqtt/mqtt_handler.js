const mqtt = require('async-mqtt');
const topic_handler = require('../database/topic_handler')
const content_handler = require('../database/content_handler')

// Loads environment variables from .env file
require('dotenv').config();

// TODO move connection logic to different file //
const serverIp = process.env.MQTT_HOST + ':' + process.env.MQTT_PORT;

const clientOptions = 
{
    clientId: process.env.MQTT_CLIENTNAME,
    connectTimeout: 5000,
    clean: false
}

var client = null;

var connectWithRetry = async function() 
{
    try {
        const connectedClient = await mqtt.connectAsync(serverIp, clientOptions, false);
        client = connectedClient;

        console.info('MQTT: Connected to server.')

        initializeMessageHandler();
    }
    catch (error) {
        console.error('MQTT: Failed to connect to server, retrying in 5 seconds...');
        setTimeout(connectWithRetry, 5000);
    }
}

connectWithRetry();

function initializeMessageHandler()
{
    client.on('message', async function (topic, message) {
        const messageObject = JSON.parse(message);
    
        if (messageObject.client != 'System') {
            const topicData = await topic_handler.getTopicByName(topic).catch((err) => console.log(err));
            const contentData = await content_handler.getContentById(topicData.content_id).catch((err) => console.log(err));
    
            const toReturnContentData = {
                client: 'System',
                message: '200',
                contentUrl: contentData.content_url,
                contentType: contentData.content_type
            }
    
            var returnMessage = JSON.stringify(toReturnContentData);
    
            await client.publish(topic, returnMessage).catch((err) => console.log(err));
        }
    })

    console.info('MQTT: Initialized message handler.');
}
// TODO move connection logic to different file //

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