// -----------------------------------------------------------------------------
// DEFINE CONSTANTS AND VARIABLES
// -----------------------------------------------------------------------------
const {app, BrowserWindow, Menu, Tray, ipcMain, electron, globalShortcut } = require("electron");

const log = require("electron-log"); // for: logging to file
const shell = require("electron").shell; // for: opening external urls in default browser
const isOnline = require("is-online"); // for online connectivity checks
const AutoLaunch = require("auto-launch"); // for autostart
const path = require("path");
const fs = require("fs");
const defaultUserDataPath = app.getPath("userData"); // for: storing window position and size
const gotTheLock = app.requestSingleInstanceLock(); // for: single-instance handling


// Keep a global reference of the window objects,
// if you don't, the window will be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let configWindow;

let verbose;
verbose = false;






// menu.js
require("./menu").createMenu();




/**
* @name writeLog
* @summary Writes to log file (and if verbose parameter is given as well to console)
* @description Writes to log file (and if verbose parameter is given as well to console)
*/
function writeLog(logType, logMessage)
{
    // configure: logging to file
    //
    log.transports.file.level = true;

    // configure: logging to console (default)
    //
    log.transports.console.level = false;
    if(verbose === true) // enable output if verbose parameter is given
    {
        log.transports.console.level = true;
    }
    
    // add prefix for all logs from [M]ain
    logMessage = "[M] " + logMessage;

    switch (logType)
    {
        case "info":
            log.info(logMessage);
            break;

        case "warn":
            log.warn(logMessage);
            break;

        case "error":
            log.error(logMessage);
            break;

        default:
            log.info(logMessage);
    }
}


/**
* @name checkNetworkConnectivity
* @summary Checks if internet is accessible
* @description Checks if the internet is accessible, if not triggers an error in the mainWindow
*/
function checkNetworkConnectivity()
{
    (async () => {

    if(await isOnline() === true)
    {
        writeLog("info", "checkNetworkConnectivity ::: Got access to the internet.");
    }
    else
    {
        writeLog("error", "checkNetworkConnectivity ::: Got NO access to the internet.");

        // app should show an error
        mainWindow.webContents.send("showNoConnectivityError");
    }
})();
}


/**
* @name checkArguments
* @summary Parses the supplied parameters
* @description Parses the supplied parameters
*/
function checkArguments()
{
    // using https://www.npmjs.com/package/minimist could improve handling

    //log.info(process.argv);

    // ignore the first 2 arguments
    //log.info(process.argv.slice(2));
    process.argv = process.argv.slice(2)

    for (var key in process.argv)
    {
        if (process.argv.hasOwnProperty(key))
        {
            //console.log(key + " -> " + process.argv[key]);

            switch (process.argv[key])
            {
                case "verbose":
                case "debug":
                    log.info("Enabling verbose/debug mode");
                    verbose = true;
                    break;

                default:
                    // nothing to do here
                    log.warn("Ignoring unsupported parameter: " + process.argv[key]);
                    break;
            }
        }
    }
}



/**
* @name createWindow
* @summary Creates the main window  of the app
* @description Creates the main window, restores window position and size of possible
*/
function createWindow ()
{
    // Check last window position and size from user data
    var windowWidth;
    var windowHeight;
    var windowPositionX;
    var windowPositionY;

    // Read a local config file
    var customUserDataPath = path.join(defaultUserDataPath, "ttthMainWindowPosSize.json");
    var data;
    try 
    {
        data = JSON.parse(fs.readFileSync(customUserDataPath, "utf8"));

        // size
        windowWidth = data.bounds.width;
        windowHeight = data.bounds.height;

        // position
        windowPositionX = data.bounds.x;
        windowPositionY = data.bounds.y;
    }
    catch(e) {
        // set some default values for window size
        windowWidth = 800;
        windowHeight = 600;
    }

    // Create the browser window.
    mainWindow = new BrowserWindow({
        title: "${productName}",
        frame: true, // false results in a borderless window
        show: false, // hide until: ready-to-show
        width: windowWidth,
        height: windowHeight,
        minWidth: 800,
        minHeight: 600,
        backgroundColor: "#ffffff",
        icon: path.join(__dirname, "app/img/icon/icon.png"),
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true, // # see #37
        }
    });

    // Restore window position if possible
    //
    // requirements: found values in .ttthMainWindowPosSize.json from the previous session
    if ( (typeof windowPositionX !== "undefined") && (typeof windowPositionY !== "undefined") )
    {
        mainWindow.setPosition(windowPositionX, windowPositionY);
    }

    // set the user agent
    //changeUserAgent();

    // and load the html of the app.
    mainWindow.loadFile("app/mainWindow.html");

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // show the formerly hidden main window as it is fully ready now
    mainWindow.on("ready-to-show", function()
    {
        mainWindow.show();
        mainWindow.focus();

        writeLog("info", "mainWindow is now ready, so show it and then focus it (event: ready-to-show)");
    });


    // When dom is ready
    //
    mainWindow.webContents.once("dom-ready", () => {
        let name = require("./package.json").name;
        let version = require("./package.json").version;
        let windowTitle = name + " " + version;
        mainWindow.setTitle(windowTitle);

        writeLog("info", "DOM is now ready (event: dom-ready)");
    });


    // When page title gets changed
    //
    mainWindow.webContents.once("page-title-updated", () => {
        writeLog("info", "mainWindow got new title (event: page-title-updated");
    });


    // when the app is shown
    //
    mainWindow.on("show", function()
    {
        writeLog("info", "mainWindow is visible (event: show)");
    });


    // when the app loses focus / aka blur
    //
    mainWindow.on("blur", function()
    {
        writeLog("info", "mainWindow lost focus (event: blur)");
    });


    // when the app gets focus
    //
    mainWindow.on("focus", function()
    {
        writeLog("info", "mainWindow got focus (event: focus)");
    });


    // when the app goes fullscreen
    //
    mainWindow.on("enter-full-screen", function()
    {
        writeLog("info", "mainWindow is now in fullscreen (event: enter-full-screen)");
    });


    // when the app goes leaves fullscreen
    //
    mainWindow.on("leave-full-screen", function()
    {
        writeLog("info", "mainWindow leaved fullscreen (event: leave-full-screen)");
    });


    // when the app gets resized
    //
    mainWindow.on("resize", function()
    {
        writeLog("info", "mainWindow got resized (event: resize)");
    });


    // when the mainwindow gets moved
    //
    mainWindow.on("move", function()
    {
        //writeLog("info", "mainWindow got moved (event: move)");

        //let bounds = mainWindow.getNormalBounds();
        //writeLog("info", "x:" + bounds.x + " y:" + bounds.y + " width:" + bounds.width + " height:" + bounds.height );

        // TODO: 
        // move configWindow as well, if mainWindow is moved. To have it always above the mainWindow
        //
        // Be aware: On macOS the child windows will keep the relative position to parent window 
        // when parent window moves, while on Windows and Linux child windows will not move.
    });


    // when the app gets hidden
    //
    mainWindow.on("hide", function()
    {
        writeLog("info", "mainWindow is hidden (event: hide)");
    });


    // when the app gets maximized
    //
    mainWindow.on("maximize", function()
    {
        writeLog("info", "mainWindow maximized (event: maximized)");
    });


    // when the app gets unmaximized
    //
    mainWindow.on("unmaximize", function()
    {
        writeLog("info", "mainWindow unmaximized (event: unmaximized)");
    });


    // when the app gets minimized
    //
    mainWindow.on("minimize", function()
    {
        writeLog("info", "mainWindow is minimized (event: minimize)");
    });


    // when the app gets restored from minimized mode
    //
    mainWindow.on("restore", function()
    {
        writeLog("info", "mainWindow was restored (event: restore)");
    });


    mainWindow.on("app-command", function()
    {
        writeLog("info", "mainWindow got app-command (event: app-command)");
    });


    // Emitted before the window is closed.
    //
    mainWindow.on("close", function ()
    {
        writeLog("info", "mainWindow will close (event: close)");

        // close configWindow
        configWindow.close();

        // Saving window position and size
        //
        // get window position and size:
        var data = {
            bounds: mainWindow.getBounds()
        };
        // store it to file in user data
        var customUserDataPath = path.join(defaultUserDataPath, "ttthMainWindowPosSize.json");
        fs.writeFileSync(customUserDataPath, JSON.stringify(data));

        writeLog("info", "mainWindow stored window -position and -size (event: close)");
    });


    // Emitted when the window is closed.
    //
    mainWindow.on("closed", function ()
    {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;

        writeLog("info", "mainWindow is closed (event: closed)");
    });


    // When the app is unresponsive
    //
    mainWindow.on("unresponsive", function ()
    {
        writeLog("error", "mainWindow is unresponsive (event: unresponsive)");
    });


    // When the app gets responsive again
    //
    mainWindow.on("responsive", function ()
    {
        writeLog("info", "mainWindow is responsive (event: responsive)");
    });


    // When the app is crashed
    //
    mainWindow.webContents.on("crashed", function ()
    {
        writeLog("info", "mainWindow crashed (event: crashed)");
    });


    // Call from renderer: Reload mainWindow
    //
    ipcMain.on("reloadMainWindow", (event) => {
        mainWindow.reload();

        writeLog("info", "mainWindow reloaded (ipcMain)");
    });


    // Call from renderer: Open folder with user configured services
    //
    ipcMain.on("openUserServicesConfigFolder", (event) => {
        var customUserDataPath = path.join(defaultUserDataPath, "storage");
        shell.openItem(customUserDataPath);

        writeLog("info", "Opening the folder which contains all user-configured services (ipcMain)");
    });


    // Call from renderer: Update Window Title
    //
    ipcMain.on("updateMainWindowTitle", (event, arg) => {
        let name = require("./package.json").name;
        let version = require("./package.json").version;
        let windowTitle = name + " " + version;
        if(arg !== "")
        {
            windowTitle = windowTitle + " - " + arg;
        }

        // update title
        mainWindow.setTitle(windowTitle);

        writeLog("info", "Updated title of mainWindow to _" + windowTitle + "_ (ipcMain)");
    });


    // Call from renderer ::: deleteAllGlobalServicesShortcut
    //
    ipcMain.on("deleteAllGlobalServicesShortcut", function( arg1, numberOfEnabledServices)
    {
        // doesnt work - whyever
        //globalShortcut.unregisterAll();

        // delete all global shortcuts
        var i;
        for (i = 1; i <= numberOfEnabledServices;  i++)
        {
            globalShortcut.unregister("CmdOrCtrl+" + i);
            writeLog("info", "Deleting the global shortcut: CmdOrCtrl+" + i);
        }

        writeLog("info", "Deleted global shortcuts (ipcMain)");
    });


    // Call from renderer ::: createNewGlobalShortcut
    //
    ipcMain.on("createNewGlobalShortcut", function(arg1, shortcut, targetTab)
    {
        writeLog("info", "Creating a new shortcut: _" + shortcut + "_ for the tab: _" + targetTab + "_.");

        const ret = globalShortcut.register(shortcut, () => {
            writeLog("info", "Shortcut: _" + shortcut + "_ was pressed.");

            // activate the related tab:
            mainWindow.webContents.send("switchToTab", targetTab);
        });
    });



    // *****************************************************************
    // modal window
    // *****************************************************************
    //
    // modal window to allow creating and configuring a single service
    configWindow = new BrowserWindow({
        parent: mainWindow,
        modal: true,
        title: "${productName}",
        frame: false, // false results in a borderless window
        show: false, // hide as default
        resizable: false,
        width: 600,
        height: 580,
        minWidth: 600,
        minHeight: 580,
        backgroundColor: "#ffffff",
        icon: path.join(__dirname, "app/img/icon/icon.png"),
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true, // see #37
        }
    });

    // load html form to the window
    configWindow.loadFile("app/configWindow.html");

    // hide menubar
    configWindow.setMenuBarVisibility(false);


    // Emitted when the window gets a close event.(close VS closed)
    //
    configWindow.on("close", function (event)
    {
        writeLog("info", "configWindow will close, but we hide it (event: close)");

        // just hide it - so it can re-opened
        configWindow.hide();
    });


    // Emitted when the window is ready to be shown
    //
    configWindow.on("ready-to-show", function (event)
    {
        writeLog("info", "configWindow is now ready to show (event: ready-to-show)");
    });


    // Emitted when the window is shown
    //
    configWindow.on("show", function (event)
    {
        writeLog("info", "configWindow is now shown (event: show)");
    });


    // Call from renderer: show configure-single-service window for a new service
    //
    ipcMain.on("showConfigureSingleServiceWindowNew", (event, arg) => {
        writeLog("info", "configWindow preparing for new service creation. (ipcMain)");

        // show window
        configWindow.show();
        configWindow.webContents.send("serviceToCreate", arg);
    });


    // Call from renderer: show configure-single-service window
    //
    ipcMain.on("showConfigureSingleServiceWindow", (event, arg) => {
        writeLog("info", "configWindow preparing for service editing (ipcMain)");

        // show window
        configWindow.show();
        configWindow.webContents.send("serviceToConfigure", arg);
    });


    // Call from renderer: hide configure-single-service window
    //
    ipcMain.on("closeConfigureSingleServiceWindow", (event) => {
        // hide window
        configWindow.hide();

        writeLog("info", "configWindow is now hidden (ipcMain)");

    });














    // Hide Menubar - Gets called from renderer
    //
    ipcMain.on("hideMenubar", function() {
        mainWindow.setMenuBarVisibility(false);
        writeLog("info", "Hiding menubar (ipcMain)");
    });

    // Show Menubar - Gets called from renderer
    //
    ipcMain.on("showMenubar", function() {
        mainWindow.setMenuBarVisibility(true);
        writeLog("info", "Un-hiding menubar (ipcMain");
    });












}


/**
* @name createTray
* @summary Creates the tray of the app
* @description Creates the tray and the related menu.
*/
function createTray()
{
    let tray = null;

    tray = new Tray(path.join(__dirname, "app/img/tray/tray_default.png"));

    const contextMenu = Menu.buildFromTemplate([
        {
            // Window focus
            id: "show",
            label: "Show Window",
            click: function () {
                // focus the main window
                if (mainWindow.isMinimized())
                {
                    mainWindow.restore();
                }
                else
                {
                    // was maybe: hidden via hide()
                    mainWindow.show();
                }
                mainWindow.focus();
            },
            enabled: true
        },
        {
            type: "separator",
            enabled: false
        },
        {
            // Quit
            id: "exit",
            label: "Exit",
            enabled: true,
            click: function () {
                app.quit();
            }
        }
    ]);

    tray.setToolTip("ttth");
    tray.setContextMenu(contextMenu);

    writeLog("info", "Finished creating tray");

    // Call from renderer: Change Tray Icon to UnreadMessages
    //
    ipcMain.on("changeTrayIconToUnreadMessages", function() {
        tray.setImage(path.join(__dirname, "app/img/tray/tray_unread.png"));
    });

    // Call from renderer: Change Tray Icon to Default
    //
    ipcMain.on("changeTrayIconToDefault", function() {
        tray.setImage(path.join(__dirname, "app/img/tray/tray_default.png"));
    });
}


/**
* @name changeUserAgent
* @summary Owerwrites the user agent
* @description Can owerwrite the user agent with a hard-coded new user string
*/
function changeUserAgent()
{
    // get the out-of-the-box userAgent
    var defaultAgent = mainWindow.webContents.getUserAgent();

    // change user agent of browser
    //
    // Examples:
    // Windows:       Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36
    //                Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.78 Safari/537.36
    // Linux:         Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36
    //
    var userAgent = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36";
    mainWindow.webContents.setUserAgent(userAgent);

    // check if setting the userAgent worked
    var newAgent = mainWindow.webContents.getUserAgent();
}


/**
* @name forceSingleAppInstance
* @summary Takes care that there is only 1 instance of this app running
* @description Takes care that there is only 1 instance of this app running
*/
function forceSingleAppInstance()
{
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
                if (mainWindow.isMinimized())
                {
                    mainWindow.restore();
                }
                mainWindow.focus();
            }
        });
    }
}



// -----------------------------------------------------------------------------
// LETS GO
// -----------------------------------------------------------------------------


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
//
app.on("ready", function ()
{
    writeLog("info", "app got ready signal (event: ready)"); 
    forceSingleAppInstance();
    checkArguments();
    createWindow();
    //createMenu();
    createTray();
    checkNetworkConnectivity();
});

// Emitted before the application starts closing its windows. 
app.on("before-quit", function ()
{
    writeLog("info", "app is preparing to quit (event: before-quit)");
});

// Emitted when all windows have been closed and the application will quit. 
app.on("will-quit", function ()
{
    writeLog("info", "app will quit (event: will-quit)");
});

// Emitted when the application is quitting.
app.on("quit", function ()
{
    writeLog("info", "Got quit event (event: quit)");
});

// Emitted when a browserWindow gets blurred. (loosing focus)
app.on("browser-window-blur", function ()
{
    writeLog("info", "app lost focus (event: browser-window-blur)");
});

// Emitted when a browserWindow gets focused.
app.on("browser-window-focus", function ()
{
    writeLog("info", "app got focus (event: browser-window-focus)");
});

// Emitted when failed to verify the certificate for url, to trust the certificate you should prevent the default behavior with event.preventDefault() and call callback(true).
app.on("certificate-error", function ()
{
    writeLog("info", "app failed to verify a cert (event: certificate-error)");
});

// Emitted when remote.require() is called in the renderer process of webContents. 
app.on("remote-require", function ()
{
    writeLog("info", "app called .require() in the renderer process (event: remote-require)");
});

// Emitted when remote.getGlobal() is called in the renderer process of webContents. 
app.on("remote-get-global", function ()
{
    writeLog("info", "app called .getGlobal() in the renderer process (event: remote-get-global)");
});

// Emitted when remote.getBuiltin() is called in the renderer process of webContents.
app.on("remote-get-builtin", function ()
{
    writeLog("info", "app called .getBuiltin() in the renderer process (event: remote-get-builtin)");
});

// Emitted when remote.getCurrentWindow() is called in the renderer process of webContents.
app.on("remote-get-current-window", function ()
{
    writeLog("info", "app called .getCurrentWindow() in the renderer process(event: remote-get-current-window)");
});

// Emitted when remote.getCurrentWebContents() is called in the renderer process of webContents
app.on("remote-get-current-web-contents", function ()
{
    writeLog("info", "app called .getCurrentWebContents() in the renderer process (event: remote-get-current-web-contents)");
});


// Quit when all windows are closed.
//
app.on("window-all-closed", function ()
{
    writeLog("info", "All application windows are now closed (event: window-all-closed)"); 

    // On macOS it is common for applications and their menu bar to stay active until the user quits explicitly with Cmd + Q
    /*
    if (process.platform !== "darwin")
    {
        writeLog("info", "Bye."); 
        app.quit();
    }
    */

    // we handle it the same on all platforms - closing the main windows closes the app
    writeLog("info", "Bye."); 
    app.quit();

});


// activate = macOS only:
// Emitted when the application is activated. 
// Various actions can trigger this event, such as launching the application for the first time,
// attempting to re-launch the application when it's already running,
// or clicking on the application's dock or taskbar icon.
//
app.on("activate", function ()
{
    writeLog("info", "app got activate event (event: activate)"); 

    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null)
    {
        writeLog("warn", "Trying to re-create the mainWindow, as it doesnt exist anymore (event: activate)"); 

        //forceSingleAppInstance();
        createWindow();
        //createMenu();
        //createTray();
    }
});




process.on("uncaughtException", (err, origin) => {
  fs.writeSync(
    process.stderr.fd,
    `Caught exception: ${err}\n` +
    `Exception origin: ${origin}`
  );
});
