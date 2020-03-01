const mqtt = require("async-mqtt");
const mqtt_pub = require("./mqtt-publisher");
const mqtt_sub = require("./mqtt-subscriber");

class mqtt_connection {
    client = null;

    connectToServer(serverIp) {
        return new Promise((resolve, reject) => {
            mqtt.connectAsync(serverIp, null, false)
                .then((connectedClient) => {
                    this.client = connectedClient;
                    resolve(this.client);
                })
                .catch((error) => {
                    reject(Error("Error connecting to server, error: " + error));
                });
        })
    }

    subscribeToTopic(topic) {
        return new Promise((resolve, reject) => {
            if (this.clientIsValid()) {
                this.client.subscribe(topic)
                    .then((success) => {
                        resolve("Successfully created topic: " + topic);
                    })
                    .catch((error) => {
                        reject(Error("Could not create topic, error: " + error));
                    })
            } else {
                reject(Error("Client is not connected to server, please connect to a server."));
            }
        })
    }

    publishMessageToTopic(topic, message) {
        return new Promise((resolve, reject) => {
            if (this.clientIsValid()) {
                this.client.publish(topic, message)
                    .then((success) => {
                        resolve("Successfully published message to topic: " + topic);
                    })
                    .catch((error) => {
                        reject(Error("Could not send message to topic: " + topic + "\nError: " + error));
                    })
            } else {
                reject(Error("Client is not connected to server, please connect to a server."));
            }
        })
    }

    disconnectClient() {
        return new Promise(resolve => {
            if (this.clientIsValid()) {
                this.client.end()
                    .then((success) => {
                        resolve(success);
                    })
                    .catch((error) => {
                        reject(Error("Could not disconnect from server, error: " + error));
                    })
            }
        })
    }

    clientIsValid() {
        return this.client != null && this.client.connected == true;
    }
}

exports.mqtt_connection = mqtt_connection;