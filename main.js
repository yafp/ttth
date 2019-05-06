// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, Tray, ipcMain, electron} = require("electron");

var path = require('path');


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;


// Force single-app-instance
//
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock)
{
    // quit the second instance
    app.quit();
}
else
{
    app.on("second-instance", (event, commandLine, workingDirectory) =>
    {
        // Someone tried to run a second instance, we should focus our first instance window.
        if (mainWindow)
        {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });
}





function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 600,
        backgroundColor: '#312450',
        icon: path.join(__dirname, 'assets/icons/png/64x64.png'),
        webPreferences: {
            nodeIntegration: true
        }
    });

    // show out of the box default userAgent
    //
    var defaultAgent = mainWindow.webContents.getUserAgent();
    process.stdout.write(defaultAgent+"\n");

    // change user agent of browser
    //
    // Windows:       Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36
    //                Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.78 Safari/537.36
    // Linux:         Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36
    //                Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36
    //
    var userAgent = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36";
    mainWindow.webContents.setUserAgent(userAgent);
    // check if setting agent worked
    var newAgent = mainWindow.webContents.getUserAgent();
    process.stdout.write("New userAgent is set to: " + newAgent+"\n");






    // test to use console.log in main.js
    //
    var nodeConsole = require("console");
    var myConsole = new nodeConsole.Console(process.stdout, process.stderr);
    //myConsole.log("Hello World!");

    if(app.isPackaged)
    {
        myConsole.log("app is packaged");
    }
    else {
        myConsole.log("app is NOT packaged");
    }



    // and load the index.html of the app.
    //
    mainWindow.loadFile("app/index.html");


    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on("closed", function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
//
app.on("ready", createWindow);







// Quit when all windows are closed.
app.on("window-all-closed", function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin")
    {
        app.quit();
    }
});

app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null)
    {
        createWindow();
    }
});


// Tray Icon
//


let tray = null;
app.on("ready", () => {

    tray = new Tray("app/img/icon/iconTray.png");
    const contextMenu = Menu.buildFromTemplate([
        {
            // Window focus
            //
            id: "test",
            label: "Show Window",
            click: function () {
                // focus the main window
                if (mainWindow.isMinimized())
                {
                    mainWindow.restore();
                }
                mainWindow.focus();
            },
            enabled: true
        },
        {
            // Appname & Version
            //
            label: app.getName() + " (Version: " + app.getVersion() + ")",
            /* checked: true, */
            enabled: false
        }
    ]);
    tray.setTitle("ttth");
    tray.setToolTip("ttth aka talk to the hand");
    tray.setContextMenu(contextMenu);
});



// Resize and reposition application window
//
ipcMain.on("resize-me-please", (event, arg, arg2) =>
{
    // resize window
    //
    //mainWindow.setSize(width,height)
    mainWindow.setSize(arg, arg2);

    // center window
    //
    mainWindow.center();
});
