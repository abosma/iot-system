const mqtt = require("mqtt");
const mqtt_pub = require("./mqtt-publisher");
const mqtt_sub = require("./mqtt-subscriber");

const client = mqtt.connect('mqtt://127.0.0.1:1883');

function subscribeToTopic(topic)
{
    mqtt_sub.subscribeToTopic(client, topic);
}

function publishMessageToTopic(topic, message)
{
    mqtt_pub.publishMessageToTopic(client, topic, message);
}

function disconnectClient()
{
    client.end();
}

client.on("connect", function()
{
    subscribeToTopic("test_topic")
});

client.on("message", function (topic, message)
{
    console.log("Topic: " + topic + "\nMessage: " + message);
})

exports.subscribeToTopic = subscribeToTopic;
exports.publishMessageToTopic = publishMessageToTopic;
exports.disconnectClient = disconnectClient;
