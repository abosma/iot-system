const client = require('../data/mqtt_connector').client;

function subscribeToTopic(topic) {
    return new Promise((resolve, reject) => {
        if(!client.connected) {
            reject(new Error('Not connected with MQTT Server, please try again.'))
        }
        
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
        if(!client.connected) {
            reject(new Error('Not connected with MQTT Server, please try again.'))
        }
        
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
        if(!client.connected) {
            reject(new Error('Not connected with MQTT Server, please try again.'))
        }
        
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