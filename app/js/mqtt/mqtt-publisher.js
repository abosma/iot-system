async function publishMessageToTopic(client, topic, message) {
    client.publish(topic, message);
}

exports.publishMessageToTopic = publishMessageToTopic;