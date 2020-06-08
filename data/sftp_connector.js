const sftp = require('ssh2-sftp-client');

const sftp_config = {
    host: process.env.SFTP_HOST,
    port: 22,
    username: process.env.SFTP_USERNAME,
    password: process.env.SFTP_PASSWORD,
    retries: 0,
    readyTimeout: 1000
}

const sftp_client = new sftp();

function getConnectedClient()
{
    return new Promise((resolve, reject) => {
        sftp_client.connect(sftp_config)
        .then(() => {
            resolve(sftp_client);
        })
        .catch(error => {
            reject(error);
        })
    })
}

function getConnectionStatus()
{
    // It resolves false instead of rejecting, this is so routes/status.js can easily render the status
    return new Promise((resolve, reject) => {
        sftp_client.connect(sftp_config)
        .then(async () => {
            var currentDirectory = await sftp_client.cwd();
            
            if(currentDirectory != null)
            {
                resolve(true);
            }

            resolve(false);
        })
        .catch(error => {
            reject(error);
        })
        .finally(async () => {
            await sftp_client.end();
        })
    })
}

module.exports =
{
    getConnectedClient,
    getConnectionStatus
}