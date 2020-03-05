// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

var mqttHandler = require("./app/js/mqtt/mqtt-controller").mqtt_handler;
var qrHandler = require("./app/js/qr/qr-controller");
var dbHandler = require("./app/js/database/db-controller").db_handler;

var mqtt_con;
var db_con;

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

function connectToServers() {
    mqtt_con = new mqttHandler();
    db_con = new dbHandler();

    mqtt_con.connectToServer("mqtt://127.0.0.1:1883")
        .then((resolve) => {
            mqtt_con.startMessageCallback();
            console.log("Connected to MQTT Server.")
            
            db_con.connectToDatabase()
            .then((resolve) =>
            {
                console.log(resolve);
            })
            .catch((reject) =>
            {
                console.log(reject.message);
            })
        })
        .catch((reject) => {
            console.log(reject.message);
        })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", function () {
    createWindow();
    connectToServers();
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
    db_con.createTopic(topic);
    
    mqtt_con.subscribeToTopic(topic)
        .then((success) => {
            qrHandler.generateDataUrl(topic)
            .then((qrCodeImage) =>
            {
                event.reply("render-qr", topic, qrCodeImage);
            })
            .catch((error) =>
            {
                console.log(error);
            });
        })
        .catch((error) => {
            console.log(error.message);
        });
});

ipcMain.on("send-message", (event, topic, message) => {
    mqtt_con.publishMessageToTopic(topic, message)
        .then((success) => {
            console.log(success);
        })
        .catch((error) => {
            console.log(error.message);
        });
});