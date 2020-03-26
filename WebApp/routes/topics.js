var express = require('express');
var router = express.Router();
var topic_handler = require('./database/topic_handler')

router.get('/', function(req, res)
{
    topic_handler.getTopics();
})

router.get('/:topicId', function(req, res)
{
    let topicId = req.params.topicId;

    topic_handler.getTopic(topicId);
})

router.post('/', function(req, res)
{
    let { topicName } = req.body;

    topic_handler.createTopic(topicName);
})

router.put('/:topicId', function(req, res)
{
    let topicId = req.params.topicId;
    let { topicName, contentId } = req.body;

    topic_handler.updateTopic(topicName, contentId, topicId);
})

router.delete('/', function(req, res)
{
    let topicId = req.params.topicId;

    topic_handler.deleteTopic(topicId);
})

module.exports = router;