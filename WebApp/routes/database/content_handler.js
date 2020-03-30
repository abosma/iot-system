const db = require('./database_connector')

function getContent(contentId) {
    return db.query('SELECT * FROM content WHERE id = $1::integer', [contentId]);
}

function getAllContent() {
    return db.query('SELECT * FROM content');
}

function createContent(contentUrl, contentType) {
    return db.query('INSERT INTO content VALUES(DEFAULT, $1::varchar, $2::varchar) ON CONFLICT DO NOTHING', [contentUrl, contentType])
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
    return db.query('DELETE FROM content WHERE id = $1::integer', [contentId]);
}

module.exports = {
    getContent,
    getAllContent,
    createContent,
    updateContent,
    deleteContent
}