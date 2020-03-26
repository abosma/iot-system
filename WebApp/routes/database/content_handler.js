const db = require('./database_connector')

function getContent(contentId) {
    return db.query('SELECT * FROM content WHERE id = $1::integer', [contentId]);
}

function getAllContent() {
    return db.query('SELECT * FROM content');
}

function createContent(contentUrl) {
    return db.query('INSERT INTO content VALUES(DEFAULT, $1::varchar) ON CONFLICT DO NOTHING', [contentUrl])
}

function updateContent(contentUrl, contentId) {
    db.query('UPDATE content SET content_url = $1::varchar WHERE id = $2::integer', [contentUrl, contentId], (err, res) => {
        if (err) {
            return err;
        }

        return res;
    })
}

function deleteContent(contentId) {
    db.query('DELETE FROM content WHERE id = $1::integer', [contentId], (err, res) => {
        if (err) {
            return err;
        }

        return res;
    })
}

module.exports = {
    getContent,
    getAllContent,
    createContent,
    updateContent,
    deleteContent
}