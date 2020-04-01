const db = require('./database_connector');

function getTopicById(topicId) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM topic WHERE id = $1::integer', [topicId])
        .then((data) => {
            const toReturnTopic = data.rows[0];
            
            resolve(toReturnTopic);
        })
        .catch((err) => {
            reject(err);
        })
    })
}

function getTopicByName(topicName) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM topic WHERE topic_name = $1::varchar', [topicName])
        .then((data) => {
            const toReturnTopic = data.rows[0];
            
            resolve(toReturnTopic);
        })
        .catch((err) => {
            reject(err);
        })
    })
}

function getTopics() {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM topic')
        .then((data) => {
            const toReturnTopicList = data.rows;

            resolve(toReturnTopicList);
        })
        .catch((err) => {
            reject(err);
        })
    })
}

function createTopic(topicName) {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO topic VALUES(DEFAULT, NULL, $1::varchar) ON CONFLICT DO NOTHING', [topicName])
        .then(() => {
            resolve();
        })
        .catch((err) => {
            reject(err);
        })
    })
}

function updateTopic(topicName, contentId, topicId) {
    return new Promise((resolve, reject) => {
        db.query('UPDATE topic SET topic_name = $1::text, content_id = $2::integer WHERE id = $3::integer', [topicName, contentId, topicId])
        .then(() => {
            resolve();
        })
        .catch((err) => {
            reject(err);
        })
    })
}

function deleteTopic(topicId) {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM topic WHERE id = $1::integer', [topicId])
        .then(() => {
            resolve();
        })
        .catch((err) => {
            reject(err);
        })
    })
}

module.exports = {
    getTopicById,
    getTopicByName,
    getTopics,
    createTopic,
    updateTopic,
    deleteTopic
}