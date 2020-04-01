const mqtt = require('async-mqtt');
const topic_handler = require('../database/async_topic_handler')
const content_handler = require('../database/content_handler')

// Loads environment variables from .env file
require('dotenv').config();

const serverIp = process.env.MQTT_HOST + ':' + process.env.MQTT_PORT;
const client = mqtt.connect(serverIp);

initializeMqttHandler();

function initializeMqttHandler() {
    client.on('message', async function (topic, message) {
        const topicData = await topic_handler.getTopicByName(topic).catch((err) => console.log(err));
        const contentData = await content_handler.getContent(topicData.content_id).catch((err) => console.log(err));

        var returnMessage = JSON.stringify(contentData);

        await client.publish(topic, returnMessage).catch((err) => console.log(err));
    })
}

function subscribeToTopic(topic) {
    return new Promise((resolve, reject) => {
        if (clientIsValid()) {
            client.subscribe(topic)
                .then(() => {
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        } else {
            reject(new Error('Client is not connected to an MQTT server.'));
        }
    });
}

function unsubscribeToTopic(topic) {
    return new Promise((resolve, reject) => {
        if (clientIsValid()) {
            client.unsubscribe(topic)
                .then(() => {
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        } else {
            reject(new Error('Client is not connected to an MQTT server.'));
        }
    });
}

function publishMessageToTopic(topic, message) {
    return new Promise((resolve, reject) => {
        if (clientIsValid()) {
            client.publish(topic, message)
                .then(() => {
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        } else {
            reject(new Error('Client is not connected to an MQTT server.'));
        }
    });
}

function disconnectClient() {
    return new Promise((resolve, reject) => {
        if (clientIsValid()) {
            client.end()
                .then(() => {
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        } else {
            reject(new Error('Client is not connected to an MQTT server.'));
        }

    });
}

function clientIsValid() {
    return client != null && client.connected == true;
}

module.exports = {
    subscribeToTopic,
    unsubscribeToTopic,
    publishMessageToTopic,
    disconnectClient
}