const db = require('./database_connector')

function getContentById(contentId) {
    return new Promise((resolve, reject) => 
    {
        db.query('SELECT * FROM content WHERE id = $1::integer', [contentId])
        .then((data) => {
            const toReturnContent = data.rows[0];

            resolve(toReturnContent);
        })
        .catch((err) => {
            reject(err);
        })
    })
}

function getAllContent() {
    return new Promise((resolve, reject) => 
    {
        db.query('SELECT * FROM content')
        .then((data) => {
            const toReturnContentList = data.rows;

            resolve(toReturnContentList);
        })
        .catch((err) => {
            reject(err);
        })
    })
}

function createContent(contentUrl, contentType) {
    return new Promise((resolve, reject) => 
    {
        db.query('INSERT INTO content VALUES(DEFAULT, $1::varchar, $2::varchar) ON CONFLICT DO NOTHING', [contentUrl, contentType])
        .then(() => {
            resolve();
        })
        .catch((err) => {
            reject(err);
        })
    })
}

function updateContent(contentUrl, contentType, contentId) {
    if (contentUrl && !contentType) {
        return db.query('UPDATE content SET content_url = $1::varchar WHERE id = $2::integer', [contentUrl, contentId]);
    } else if (!contentUrl && contentType) {
        return db.query('UPDATE content SET content_type = $1::varchar WHERE id = $2::integer', [contentType, contentId]);
    } else if (contentUrl && contentType) {
        return db.query('UPDATE content SET content_url = $1::varchar, content_type = $2::varchar WHERE id = $3::integer', [contentUrl, contentType, contentId]);
    }
}

function deleteContent(contentId) {
    return new Promise((resolve, reject) => 
    {
        db.query('DELETE FROM content WHERE id = $1::integer', [contentId])
        .then(() => {
            resolve();
        })
        .catch((err) => {
            reject(err);
        })
    })
}

module.exports = {
    getContentById,
    getAllContent,
    createContent,
    updateContent,
    deleteContent
}