const qrcode = require("qrcode");

function generateDataUrl(message)
{
    return new Promise((resolve, reject) =>
    {
        qrcode.toDataURL(message)
        .then((url) => 
        {
            resolve(url);
        }, (error) =>
        {
            reject(error);
        })
    })
}

exports.generateDataUrl = generateDataUrl;