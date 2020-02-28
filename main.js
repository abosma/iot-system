// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const qrcode = require("qrcode");
const mqtt_con = require("./app/js/mqtt/mqtt-connection")

// Hot reloading of electron application, looks for changes in ./app folder.
require("electron-reload")("./app");

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow
        (
            {
                width: 800,
                height: 600,
                webPreferences: {
                    preload: path.join(__dirname, "preload.js"),
                    nodeIntegration: true
                }
            }
        )

    // and load the index.html of the app.
    mainWindow.loadFile("./app/index.html")
    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", function () {
    createWindow();
})

// Quit when all windows are closed.
app.on("window-all-closed", function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        mqtt_con.disconnectClient();
        app.quit();
    }
})

app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on("create-topic", (event, topic) => {
    mqtt_con.subscribeToTopic(topic);

    qrcode.toDataURL(topic, function (err, url) {
        if (!err) {
            event.reply("render-qr", topic, url);
        }
    })
});

ipcMain.on("send-message", (event, topic, message) => {
    mqtt_con.publishMessageToTopic(topic, message);
});