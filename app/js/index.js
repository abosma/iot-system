const ipcRenderer = require("electron");

document.getElementById("testButton").addEventListener("click", function()
{
    alert("Test");
    ipcRenderer.send("send-message")
});