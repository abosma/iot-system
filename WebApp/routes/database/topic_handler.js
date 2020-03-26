const db = require('./database_connector')

function getTopic(topicId)
{
    db.query('SELECT * FROM topic WHERE id = $1::integer', [topicId], (err, res) =>
    {
        if(err)
        {
            return err;
        }

        return res;
    })
}

function getTopics()
{
    db.query('SELECT * FROM topic', null, (err, res) =>
    {
        if(err)
        {
            return err;
        }

        return res;
    })
}

function createTopic(topicName)
{
    db.query('INSERT INTO topic VALUES(DEFAULT, NULL, $2::text) ON CONFLICT DO NOTHING', [topicName], (err, res) =>
    {
        if(err)
        {
            return err;
        }

        return res;
    })
}

function updateTopic(topicName, contentId, topicId)
{
    db.query('UPDATE topic SET topic_name = $1::text, content_id = $2::integer WHERE id = $3::integer', [topicName, contentId, topicId], (err, res) =>
    {
        if(err)
        {
            return err;
        }

        return res;
    })
}

function deleteTopic(topicId)
{
    db.query('DELETE FROM topic WHERE id = $1::integer', [topicId], (err, res) =>
    {
        if(err)
        {
            return err;
        }

        return res;
    })
}

module.exports = 
{
    getTopic,
    getTopics,
    createTopic,
    updateTopic,
    deleteTopic
}