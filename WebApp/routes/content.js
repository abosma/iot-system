var express = require('express');
var router = express.Router();
var content_handler = require('./database/content_handler')

router.get('/', async function (req, res) {
    content_handler.getAllContent()
    .then(data => {
        res.render('content', {
            contentList: data.rows
        })
    })
    .catch(err => {
        res.render('content', {
            errorMessage: err
        })
    })
})

router.get('/:contentId', async function (req, res) {
    let contentId = req.params.contentId;

    content_handler.getContent(contentId)
    .then(data => {
        res.render('content', {
            content: data
        })
    }).catch(err => {
        res.render('content', {
            errorMessage: err
        })
    })
})

router.post('/', async function (req, res) {
    const { contentUrl } = req.body;

    content_handler.createContent(contentUrl)
    .then(() => {
        res.redirect('/content');
    })
    .catch(err => {
        res.render('content', {
            errorMessage: err
        })
    })
})

router.put('/:contentId', function (req, res) {
    let contentId = req.params.contentId;
    let contentUrl = req.body;

    content_handler.updateContent(contentUrl, contentId);
})

router.delete('/', function (req, res) {
    let contentId = req.params.contentId;

    content_handler.deleteContent(contentId);
})

module.exports = router;