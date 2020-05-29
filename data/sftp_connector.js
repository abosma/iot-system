const sftp = require('ssh2-sftp-client');

const sftp_config = {
    host: process.env.SFTP_HOST,
    port: 22,
    username: process.env.SFTP_USERNAME,
    password: process.env.SFTP_PASSWORD
}

const sftp_client = new sftp();

function getConnectionStatus()
{
    // It resolves false instead of rejecting, this is so routes/status.js can easily render the status
    return new Promise((resolve, reject) => {
        sftp_client.connect(sftp_config)
        .then(() => {
            await sftp_client.end();
            resolve(true);
        })
        .catch(error => {
            resolve(false);
        })
    })
}

module.exports =
{
    sftp_client,
    getConnectionStatus
}