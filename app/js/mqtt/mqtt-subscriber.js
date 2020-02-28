function subscribeToTopic(client, topic) {
    client.subscribe(topic);
}

exports.subscribeToTopic = subscribeToTopic;