'use strict'

const { ipcRenderer } = require("electron");

document.getElementById("subscribeButton").addEventListener("click", () => {
    ipcRenderer.send("create-topic", "test_topic");
})

document.getElementById("sendButton").addEventListener("click", () => {
    ipcRenderer.send("send-message", "test_topic", "This is a test message!");
})

ipcRenderer.on("render-qr", (event, topic, qrcode) => {
    var newImage = '<tr>' +
        '<td><img src="' + qrcode + '" class="img-fluid"></img></td>' +
        '<td>' + topic + '</td>' +
        '</tr>';

    var imageHolder = document.getElementById("qrTable");

    imageHolder.innerHTML += newImage;
})

ipcRenderer.on("render-message", (event, topic, message) => {
    var messageText = document.getElementById("messageText");
    var messageTopic = document.getElementById("messageTopic");

    messageText.innerText = message;
    messageTopic.innerText = topic;
})