const mqtt_connector = require("./mqtt_connector");
const topic_handler = require('../database/topic_handler')
const content_handler = require('../database/content_handler')
const logger = require('../../logging/winston')

var client = null;

async function initializeHandler()
{
    client = await mqtt_connector.connectWithRetry();
    initializeMessageHandler(client);
}

initializeHandler();

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