const db = require('./database_connector')

function getTopic(topicId) {
    return db.query('SELECT * FROM topic WHERE id = $1::integer', [topicId]);
}

function getTopics() {
    return db.query('SELECT * FROM topic');
}

function createTopic(topicName) {
    return db.query('INSERT INTO topic VALUES(DEFAULT, NULL, $1::text) ON CONFLICT DO NOTHING', [topicName]);
}

function updateTopic(topicName, contentId, topicId) {
    if (contentId && !topicName) {
        return db.query('UPDATE topic SET content_id = $1::integer WHERE id = $2::integer', [contentId, topicId]);
    } else if (!contentId && topicName) {
        return db.query('UPDATE topic SET topic_name = $1::text WHERE id = $2::integer', [topicName, topicId]);
    } else if (contentId && topicName) {
        return db.query('UPDATE topic SET topic_name = $1::text, content_id = $2::integer WHERE id = $3::integer', [topicName, contentId, topicId]);
    }
}

function deleteTopic(topicId) {
    return db.query('DELETE FROM topic WHERE id = $1::integer', [topicId]);
}

module.exports = {
    getTopic,
    getTopics,
    createTopic,
    updateTopic,
    deleteTopic
}