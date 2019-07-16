// Measuring startup
//
//console.time("init");


// -----------------------------------------------------------------------------
// DEFINE CONSTANTS AND VARIABLES
// -----------------------------------------------------------------------------
const {app, BrowserWindow, Menu, Tray, ipcMain, electron, globalShortcut } = require("electron");
const log = require("electron-log"); // for: logging to file
const shell = require("electron").shell; // for: opening external urls in default browser
const openAboutWindow = require("about-window").default; // for: about-window

const defaultUserDataPath = app.getPath("userData"); // for: storing window position and size
const gotTheLock = app.requestSingleInstanceLock(); // for: single-instance handling

var AutoLaunch = require("auto-launch"); // for autostart
var path = require("path");
var fs = require("fs");

// Keep a global reference of the window objects,
// if you don't, the window will be closed automatically
// when the JavaScript object is garbage collected.
let mainWindow;
let configServiceWindow;

let willQuitApp; // used for saving mainWindow / index.html


let verbose;
verbose = false;




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

    for (var key in process.argv)
    {
        if (process.argv.hasOwnProperty(key))
        {
            //console.log(key + " -> " + process.argv[key]);

            switch (process.argv[key])
            {
                case "verbose":
                    verbose = true;
                    break;


                /*
                case "v":
                case "version":
                    log.info("Version: " + app.getVersion());

                    break;
                */

                default:
                    // nothing to do here
                    break;
            }
        }
    }
}


function writeLog(logType, logMessage)
{
    if(verbose === true)
    {
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

        //log.info(logMessage);
    }
}


/**
* @name createMenu
* @summary Creates the menu
* @description Creates the menu and auto-hides it on init
*/
function createMenu()
{
    // Create a custom menu
    //
    var menu = Menu.buildFromTemplate([

    // Menu: File
    {
        label: "File",
        submenu: [
        {
            label: "Settings",
            click() {
                mainWindow.webContents.send("showSettings");
            },
            accelerator: "CmdOrCtrl+,"
        },
        {
            type: "separator"
        },
        {
            role: "quit",
            label: "Exit",
            click() {
                app.quit();
            },
            accelerator: "CmdOrCtrl+Q"
        }
    ]
    },

    // Menu: Edit
    {
        label: "Edit",
        submenu: [
        {
            label: "Undo",
            accelerator: "CmdOrCtrl+Z",
            selector: "undo:"
        },
        {
            label: "Redo",
            accelerator: "Shift+CmdOrCtrl+Z",
            selector: "redo:"
        },
        {
            type: "separator"
        },
        {
            label: "Cut",
            accelerator: "CmdOrCtrl+X",
            selector: "cut:"
        },
        {
            label: "Copy",
            accelerator: "CmdOrCtrl+C",
            selector: "copy:"
        },
        {
            label: "Paste",
            accelerator: "CmdOrCtrl+V",
            selector: "paste:"
        },
        {
            label: "Select All",
            accelerator: "CmdOrCtrl+A",
            selector: "selectAll:"
        }
    ]
    },

    // Menu: View
    {
        label: "View",
        submenu: [
        {
            label: "Next Service",
            click() {
                mainWindow.webContents.send("nextTab");
            },
            accelerator: "CmdOrCtrl+right"
        },
        {
            label: "Previous Service",
            click() {
                mainWindow.webContents.send("previousTab");
            },
            accelerator: "CmdOrCtrl+left"
        },
        {
            type: "separator"
        },
        {
            role: "reload",
            label: "Reload",
            click() {
                mainWindow.reload();
            },
            accelerator: "CmdOrCtrl+R"
        },
        {
            label: "Reload current service",
            click() {
                // calling the renderer process from main.js
                mainWindow.webContents.send("reloadCurrentService", "whoooooooh!");
            },
            accelerator: "CmdOrCtrl+S",
            enabled: true
        },
        {
            type: "separator"
        },
        {
            id: "ViewToggleMenubar",
            label: "Toggle MenuBar",
            click() {
                if(mainWindow.isMenuBarVisible())
                {
                    mainWindow.setMenuBarVisibility(false);
                }
                else
                {
                    mainWindow.setMenuBarVisibility(true);
                }
            },
            accelerator: "F10"
        }
    ]
    },

    // Menu: Window
    {
        label: "Window",
        submenu: [
        {
            role: "togglefullscreen",
            label: "Toggle Fullscreen",
            click() {
                if(mainWindow.isFullScreen())
                {
                    mainWindow.setFullScreen(false);
                }
                else
                {
                    mainWindow.setFullScreen(true);
                }

            },
            accelerator: "F11" // is most likely predefined on osx - doesnt work
        },
        {
            role: "hide",
            label: "Hide",
            click() {
                mainWindow.hide();
                //mainWindow.reload();
            },
            accelerator: "CmdOrCtrl+H",
            enabled: true
        },
        {
            role: "minimize",
            label: "Minimize",
            click() {
                if(mainWindow.isMinimized())
                {
                    //mainWindow.restore();
                }
                else
                {
                    mainWindow.minimize();
                }
            },
            accelerator: "CmdOrCtrl+M",
        },
        {
            label: "Maximize",
            click() {
                if(mainWindow.isMaximized())
                {
                    mainWindow.unmaximize();
                }
                else
                {
                    mainWindow.maximize();
                }
            },
            accelerator: "CmdOrCtrl+K",
        }
    ]
    },

    // Menu: Help
    {
        role: "help",
        label: "Help",
        submenu: [
        // About
        {
            role: "about",
            label: "About",
            click() {
                openAboutWindow({
                    icon_path: path.join(__dirname, "app/img/about/icon_about.png"),
                    open_devtools: false,
                    use_version_info: true,
                    win_options:  // https://github.com/electron/electron/blob/master/docs/api/browser-window.md#new-browserwindowoptions
                    {
                        autoHideMenuBar: true,
                        titleBarStyle: "hidden",
                        minimizable: false, // not implemented on linux
                        maximizable: false, // not implemented on linux
                        movable: false, // not implemented on linux
                        resizable: false,
                        alwaysOnTop: true,
                        fullscreenable: false,
                        skipTaskbar: false
                    }
                });

            },
        },
        {
            label: "Homepage",
            click() {
                shell.openExternal("https://github.com/yafp/ttth");
            },
            accelerator: "F1"
        },
        // report issue
        {
            label: "Report issue",
            click() {
                shell.openExternal("https://github.com/yafp/ttth/issues");
            },
            accelerator: "F2"
        },
        {
            type: "separator"
        },
        // Update
        {
            label: "Search updates",
            click() {
                //mainWindow.webContents.toggleDevTools();
                mainWindow.webContents.send("startSearchUpdates");
            },
            enabled: true
            //accelerator: "F12"
        },
        {
            type: "separator"
        },
        // Console
        {
            id: "HelpConsole",
            label: "Console",
            click() {
                mainWindow.webContents.toggleDevTools();
            },
            enabled: true,
            accelerator: "F12"
        },
        {
            type: "separator"
        },
        // SubMenu
        {
            label: "Cleaner",
            submenu: [
            // Clear cache
            {
                id: "ClearCache",
                label: "Clear cache",
                click() {
                    const ses = mainWindow.webContents.session;
                    ses.clearCache(() => {

                    });
                    mainWindow.reload();
                },
                enabled: true
            },
            // Clear Local Storage
            {
                id: "ClearLocalStorage",
                label: "Clear local storage",
                click() {
                    const ses = mainWindow.webContents.session;
                    ses.clearStorageData(() => {
                        storages: ["localstorage"];
                    });
                    mainWindow.reload();
                },
                enabled: true
            },
            ]
        }
        ]
    }
    ]);


    // Logging to file
    writeLog("info", "Finished creating menues");





    // use the menu
    Menu.setApplicationMenu(menu);


    // Hide Menubar
    //
    ipcMain.on("hideMenubar", function() {
        mainWindow.setMenuBarVisibility(false);
        // Logging to file
        writeLog("info", "Hiding menubar (ipcMain)");
    });

    // Show Menubar
    //
    ipcMain.on("showMenubar", function() {
        mainWindow.setMenuBarVisibility(true);
        // Logging to file
        writeLog("info", "Un-hiding menubar (ipcMain");
    });


    // Disable some menu-elements - depending on the platform
    //
    var os = require("os");
    if(os.platform() === "darwin")
    {
        // see #21
        Menu.getApplicationMenu().items; // all the items
        var item = Menu.getApplicationMenu().getMenuItemById("ViewToggleMenubar");
        item.enabled = false;

        // Logging to file
        writeLog("info", "Disabling toggle-menubar menu element on osx");
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
    var customUserDataPath = path.join(defaultUserDataPath, "ttthUserData.json");
    var data;
    try {
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
    // requirements: found values in .tttUSerData.json from the previous session
    if ( (typeof windowPositionX !== "undefined") && (typeof windowPositionY !== "undefined") )
    {
        mainWindow.setPosition(windowPositionX, windowPositionY);
    }

    // set the user agent
    //changeUserAgent();

    // and load the index.html of the app.
    mainWindow.loadFile("app/index.html");

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // show the formerly hidden main window as it is fully ready now
    //
    mainWindow.on("ready-to-show", function()
    {
        mainWindow.show();
        mainWindow.focus();

        // Logging to file
        writeLog("info", "mainWindow is now ready, shown and on focus (event: ready-to-show");
    });


    // When dom is ready
    //
    mainWindow.webContents.once("dom-ready", () => {
        let name = require("./package.json").name;
        let version = require("./package.json").version;
        let windowTitle = name + " " + version;
        mainWindow.setTitle(windowTitle);

        // Logging to file
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
        // Logging to file
        writeLog("info", "mainWindow is visible (event: show)");
    });


    // when the app loses focus / aka blur
    //
    mainWindow.on("blur", function()
    {
        // Logging to file
        writeLog("info", "mainWindow lost focus (event: blur)");
    });


    // when the app gets focus
    //
    mainWindow.on("focus", function()
    {
        // Logging to file
        writeLog("info", "mainWindow got focus (event: focus)");
    });


    // when the app goes fullscreen
    //
    mainWindow.on("enter-full-screen", function()
    {
        // Logging to file
        writeLog("info", "mainWindow is now in fullscreen (event: enter-full-screen)");
    });


    // when the app goes leaves fullscreen
    //
    mainWindow.on("leave-full-screen", function()
    {
        // Logging to file
        writeLog("info", "mainWindow leaved fullscreen (event: leave-full-screen)");
    });


    // when the app gets resized
    //
    mainWindow.on("resize", function()
    {
        // Logging to file
        writeLog("info", "mainWindow got resized (event: resize)");
    });

    // when the app gets moved
    //
    mainWindow.on("move", function()
    {
        // Logging to file
        writeLog("info", "mainWindow got moved (event: move)");
    });

    // when the app gets hidden
    //
    mainWindow.on("hide", function()
    {
        // Logging to file
        writeLog("info", "mainWindow is hidden (event: hide)");
    });

    // when the app gets maximized
    //
    mainWindow.on("maximize", function()
    {
        // Logging to file
        writeLog("info", "mainWindow maximized (event: maximized)");
    });

    // when the app gets unmaximized
    //
    mainWindow.on("unmaximize", function()
    {
        // Logging to file
        writeLog("info", "mainWindow unmaximized (event: unmaximized)");
    });

    // when the app gets minimized
    //
    mainWindow.on("minimize", function()
    {
        // Logging to file
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

        // close configServiceWindow
        configServiceWindow.close();

        // Saving window position and size
        //
        // get window position and size:
        var data = {
            bounds: mainWindow.getBounds()
        };
        // store it to file in user data
        var customUserDataPath = path.join(defaultUserDataPath, "ttthUserData.json");
        fs.writeFileSync(customUserDataPath, JSON.stringify(data));

        // Logging to file
        writeLog("info", "mainWindow stored window -position and -size (event: close)");


        // TODO
        //
        // add with 1.5.0
        //
        /*
        saveState()

        if (willQuitApp || process.platform !== 'darwin')
        {
            // the user tried to quit the app
            mainWindow = null
        }
        else
        {
            //the user only tried to close the window
            e.preventDefault()
            mainWindow.hide()
        }
        */
        // End TODO

    });


    // Emitted when the window is closed.
    //
    mainWindow.on("closed", function ()
    {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;

        // Logging to file
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
        // Logging to file
        writeLog("info", "mainWindow crashed (event: crashed)");
    });


    // Call from renderer: Reload mainWindow
    //
    ipcMain.on("reloadMainWindow", (event) => {
        mainWindow.reload();

        // Logging to file
        writeLog("info", "mainWindow reloaded (ipcMain)");
    });


    // Call from renderer: Open folder with user configured services
    //
    ipcMain.on("openUserServicesConfigFolder", (event) => {
        var customUserDataPath = path.join(defaultUserDataPath, "storage");
        shell.openItem(customUserDataPath);

        // Logging to file
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

        // Logging to file
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
    configServiceWindow = new BrowserWindow({
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
    configServiceWindow.loadFile("app/config.html");

    // make it always on top
    //configServiceWindow.setAlwaysOnTop(true, "floating");

    // hide menubar
    configServiceWindow.setMenuBarVisibility(false);


    // Emitted when the window gets a close event.(close VS closed)
    //
    configServiceWindow.on("close", function (event)
    {
        writeLog("info", "configServiceWindow will close, but we hide it (event: close)");

        // just hide it - so it can re-opened
        configServiceWindow.hide();
    });


    // Emitted when the window is shown
    //
    configServiceWindow.on("show", function (event)
    {
        // Logging to file
        writeLog("info", "configServiceWindow is now shown (event: show)");
    });


    // Call from renderer: show configure-single-service window for a new service
    //
    ipcMain.on("showConfigureSingleServiceWindowNew", (event, arg) => {
        writeLog("info", "configServiceWindow preparing for new service creation. (ipcMain)");

        // show window
        configServiceWindow.show();
        configServiceWindow.webContents.send("serviceToCreate", arg);
    });


    // Call from renderer: show configure-single-service window
    //
    ipcMain.on("showConfigureSingleServiceWindow", (event, arg) => {
        writeLog("info", "configServiceWindow preparing for service editing (ipcMain)");

        // show window
        configServiceWindow.show();
        configServiceWindow.webContents.send("serviceToConfigure", arg);
    });


    // Call from renderer: hide configure-single-service window
    //
    ipcMain.on("closeConfigureSingleServiceWindow", (event) => {
        // hide window
        configServiceWindow.hide();

        // Logging to file
        writeLog("info", "configServiceWindow is now hidden (ipcMain)");
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
    app.on("ready", () => {

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
    });

    // Logging to file
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
* @summary Can owerwrite the user agent
* @description Can owerwrite the user agent
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



// TODO:
// add with 1.5.0
// via: https://vincelwt.github.io/optimize-electron-startup-time/index.html
const saveState = () => {

    // regex .replace is for escaping fucking windows paths
    let writePath = path.join(app.getPath("userData"), "ttth_"+app.getVersion()+"_index.html").replace(/\\/g, "\\\\");

    //console.log("main.js ::: saveState ::: Trying to save the window to: _" + writePath + "_ for faster startup times");


    mainWindow.webContents.executeJavaScript(`

        // This part depends on your app
        // In my case, I reset some elements to their original page before saving the page

        // Reset ui elements
        //getById('playerBufferBar').style.transform = getById('playerProgressBar').style.transform = 'translateX(0%)'

        //addClass('playpauseIcon', 'icon-play')
        //removeClass('playpauseIcon', 'icon-pause')
        //removeClass(".playingIcon", "blink")
        //addClass('refreshStatus', 'hide')

        // Here we write the DOM to the 'userData' folder
        // so we can use this for the next startup

        fs.writeFileSync("${writePath}",  '<!DOCTYPE html>'+document.documentElement.outerHTML)

        // Save settings
        store.set('settings', settings)
    `);
};




// -----------------------------------------------------------------------------
// LETS GO
// -----------------------------------------------------------------------------


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
//
//app.on("ready", createWindow);
app.on("ready", function ()
{
    forceSingleAppInstance();
    checkArguments();
    createWindow();
    createMenu();

});


// TODO:
// add with 1.5.0
app.on("before-quit", function ()
{
    writeLog("info", "app is preparing to quit (event: before-quit)");

    willQuitApp = true;
    //saveState()
});

app.on("will-quit", function ()
{
    writeLog("info", "app will quit (event: will-quit)");
});

app.on("quit", function ()
{
    // Logging to file
    writeLog("info", "Got quit event (event: quit)");
});

app.on("browser-window-blur", function ()
{
    // Logging to file
    writeLog("info", "app lost focus (event: browser-window-blur)");
});

app.on("browser-window-focus", function ()
{
    // Logging to file
    writeLog("info", "app got focus (event: browser-window-focus)");
});

app.on("certificate-error", function ()
{
    // Logging to file
    writeLog("info", "app failed to verify a cert (event: certificate-error)");
});

app.on("remote-require", function ()
{
    // Logging to file
    writeLog("info", "app called .require() in the renderer process (event: remote-require)");
});

app.on("remote-get-global", function ()
{
    // Logging to file
    writeLog("info", "app called .getGlobal() in the renderer process (event: remote-get-global)");
});

app.on("remote-get-builtin", function ()
{
    // Logging to file
    writeLog("info", "app called .getBuiltin() in the renderer process (event: remote-get-builtin)");
});

app.on("remote-get-current-window", function ()
{
    // Logging to file
    writeLog("info", "app called .getCurrentWindow() in the renderer process(event: remote-get-current-window)");
});

app.on("remote-get-current-web-contents", function ()
{
    // Logging to file
    writeLog("info", "app called .getCurrentWebContents() in the renderer process (event: remote-get-current-web-contents)");
});


// Quit when all windows are closed.
//
app.on("window-all-closed", function ()
{
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin")
    {
        app.quit();
    }
});


// macOS only:
// Emitted when the application is activated. Various actions can trigger this event, such as launching the application for the first time,
// attempting to re-launch the application when it's already running,
// or clicking on the application's dock or taskbar icon.
//
app.on("activate", function ()
{
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null)
    {
        forceSingleAppInstance();
        createWindow();
        createMenu();
    }
});


// create the tray
createTray();


process.on("uncaughtException", (err, origin) => {
  fs.writeSync(
    process.stderr.fd,
    `Caught exception: ${err}\n` +
    `Exception origin: ${origin}`
  );
});


// Measuring startup
//
//console.timeEnd("init");
