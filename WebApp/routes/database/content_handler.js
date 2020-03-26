const db = require('./database_connector')

getContent(contentId)
{
    db.query('SELECT * FROM content WHERE content_id = $1::integer', [contentId], (err, res) =>
    {
        if(err)
        {
            return err;
        }

        return res;
    })
}

getAllContent()
{
    db.query('SELECT * FROM content', null, (err, res) =>
    {
        if(err)
        {
            return err;
        }

        return res;
    })
}

createContent(contentUrl)
{
    db.query('INSERT INTO content VALUES(DEFAULT, $1::text) ON CONFLICT DO NOTHING', [contentUrl], (err, res) =>
    {
        if(err)
        {
            return err;
        }

        return res;
    })
}

updateContent(contentUrl, contentId)
{
    db.query('UPDATE content SET content_url = $1::varchar WHERE content_id = $2::integer', [contentUrl, contentId], (err, res) =>
    {
        if(err)
        {
            return err;
        }

        return res;
    })
}


deleteContent(contentId)
{
    db.query('DELETE FROM content WHERE content_id = $1::integer', [contentId], (err, res) =>
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
    getContent,
    getAllContent,
    createContent,
    updateContent,
    deleteContent
}