const express = require('express');
const router = express.Router();
const topic_handler = require('./database/topic_handler')

router.get('/', async function(req, res)
{
    topic_handler.getTopics()
    .then(data => {
        res.render('topics',
        {
            topicList: data.rows
        })
    })
    .catch(err => {
        throw new Error(err);
    });
})

router.get('/:topicId', async function(req, res)
{
    let topicId = req.params.topicId;

    topic_handler.getTopic(topicId)
    .then(data => {
        const { topic_name, content_id } = data.rows[0];

        res.send({
            topicName: topic_name,
            contentId: content_id
        })
    })
    .catch(err => {
        throw new Error(err);
    });
})

router.post('/', async function(req, res)
{
    const { topicName } = req.body;

    topic_handler.createTopic(topicName)
    .then(() => {
        res.redirect('/topics')
    })
    .catch(err => {
        throw new Error(err);
    });
})

router.put('/', async function(req, res)
{
    const { topicId, topicName, contentId } = req.body;

    topic_handler.updateTopic(topicName, contentId, topicId)
    .then(() => {
        res.sendStatus(200);
    })
    .catch(err => {
        throw new Error(err);
    });
})

router.delete('/', async function(req, res)
{
    const { topicId } = req.body;

    topic_handler.deleteTopic(topicId)
    .then(() => {
        res.sendStatus(200);
    })
    .catch(err => {
        throw new Error(err);
    });
})

module.exports = router;