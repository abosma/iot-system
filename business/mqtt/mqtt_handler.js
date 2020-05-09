const client = require('./mqtt_connector').client;

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

function getConnectionStatus()
{
    return client != null && client.connected;
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
    getConnectionStatus,
    disconnectClient
}