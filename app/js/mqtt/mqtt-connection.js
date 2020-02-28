const { BrowserWindow } = require("electron");
const mqtt = require("mqtt");
const mqtt_pub = require("./mqtt-publisher");
const mqtt_sub = require("./mqtt-subscriber");

const client = mqtt.connect('mqtt://127.0.0.1:1883');

function subscribeToTopic(topic) {
    mqtt_sub.subscribeToTopic(client, topic);
}

function publishMessageToTopic(topic, message) {
    mqtt_pub.publishMessageToTopic(client, topic, message);
}

function disconnectClient() {
    client.end();
}

client.on("message", (topic, message) => {
    BrowserWindow.getFocusedWindow().webContents.send("render-message", topic, message.toString());
})

exports.subscribeToTopic = subscribeToTopic;
exports.publishMessageToTopic = publishMessageToTopic;
exports.disconnectClient = disconnectClient;