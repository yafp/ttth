// Measuring startup
console.time("init");


// -----------------------------------------------------------------------------
// DEFINE CONSTANTS AND VARIABLES
// -----------------------------------------------------------------------------
const {app, BrowserWindow, Menu, Tray, ipcMain, electron } = require("electron");
const nodeConsole = require("console"); // for writing to terminal
const defaultUserDataPath = app.getPath("userData"); // for storing window position and size
const gotTheLock = app.requestSingleInstanceLock(); // for single-instance handling
const shell = require("electron").shell;
const openAboutWindow = require("about-window").default;

var AutoLaunch = require("auto-launch"); // for autostart

var path = require("path");
var fs = require("fs");
var myConsole = new nodeConsole.Console(process.stdout, process.stderr);



// -----------------------------------------------------------------------------
// CREATING THE MENU
// -----------------------------------------------------------------------------
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
            label: "Exit",
            click() {
                app.quit();
            },
            accelerator: "CmdOrCtrl+Q"
        }
    ]
    },
    // Menu: Window
    {
        label: "View",
        submenu: [
        {
            label: "Reload",
            click() {
                mainWindow.reload();
            },
             accelerator: "CmdOrCtrl+R"
        },
        {
            type: "separator"
        },
        {
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
            accelerator: "F11"
        },
        {
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
            accelerator: "F3"
        }
    ]
    },
    // Menu: Help
    {
        label: "Help",
        submenu: [
        // About
        {
            label: "About",
            click() {
                openAboutWindow({
                    icon_path: path.join(__dirname, "app/img/about/512x512.png"),
                    open_devtools: false,
                    css_path: "app/css/ttth/about.css",
                    use_version_info: true,
                    win_options:  // https://github.com/electron/electron/blob/master/docs/api/browser-window.md#new-browserwindowoptions
                    {
                        opacity: 0.9, // not implemented on linux
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
        // Console
        {
            label: "Console",
            click() {
                mainWindow.webContents.openDevTools();
            },
            enabled: true,
            accelerator: "F12"
        },
        ]
    }
    ]);

    // use the menu
    Menu.setApplicationMenu(menu);

    // hide menubar on launch
    mainWindow.setMenuBarVisibility(false);
}



// -----------------------------------------------------------------------------
// CREATING THE MAIN WINDOW
// -----------------------------------------------------------------------------
function createWindow ()
{
    // Check last window position and size from user data
    // source: https://github.com/electron/electron/issues/526
    //
    // Read a local config file
    var windowWidth;
    var windowHeight;
    var windowPositionX;
    var windowPositionY;

    var customUserDataPath = path.join(defaultUserDataPath, "init.json");
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
        title: "ttth",
        frame: true, // false results in a borderless window
        show: false, // hide until: ready-to-show
        width: windowWidth,
        height: windowHeight,
        minWidth: 800,
        minHeight: 600,
        backgroundColor: "#ffffff",
        icon: path.join(__dirname, "app/img/icon/64x64.png"),
        webPreferences: {
            nodeIntegration: true
        }
    });


    // create a menu
    createMenu();

    // Restore window position if possible
    //
    // requirements: found values in .init.json from the previous session
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

    // Emitted before the window is closed.
    mainWindow.on("close", function ()
    {
        // get window position and size:
        var data = {
            bounds: mainWindow.getBounds()
        };

        // store it to file in user data
        var customUserDataPath = path.join(defaultUserDataPath, "init.json");
        fs.writeFileSync(customUserDataPath, JSON.stringify(data));
    });


    mainWindow.on("unresponsive", function ()
    {
    });


    // show the formerly hidden main window as it is fully ready now
    //
    mainWindow.on("ready-to-show", function()
    {
        mainWindow.show();
        mainWindow.focus();
    });


    // Emitted when the window is closed.
    mainWindow.on("closed", function ()
    {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
}



// -----------------------------------------------------------------------------
// CREATE A TRAY
// -----------------------------------------------------------------------------
function createTray()
{
    let tray = null;
    app.on("ready", () => {

        tray = new Tray(path.join(__dirname, "app/img/tray/64x64_tray_default.png"));

        const contextMenu = Menu.buildFromTemplate([
            {
                // Appname & Version
                id: "info",
                icon: path.join(__dirname, "app/img/tray/24x24.png"),
                label: app.getName() + " (Version: " + app.getVersion() + ")",
                enabled: false
            },
            {
                type: "separator",
                enabled: false
            },
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
                id: "quit",
                label: "Quit",
                enabled: true,
                click: function () {
                    app.quit();
                }
            }

        ]);
        tray.setTitle("ttth");
        tray.setToolTip("ttth aka talk to the hand");
        tray.setContextMenu(contextMenu);


        // from rambox
        switch (process.platform)
        {
            case "darwin":
                break;

            case "linux":
            case "freebsd":
                // Double click is not supported and Click its only supported when app indicator is not used.
                // Read more here (Platform limitations): https://github.com/electron/electron/blob/master/docs/api/tray.md
                tray.on("click", function() {
                    myConsole.log("createTray ::: Linux click");
                });

                break;

            case "win32":
                tray.on("click", function() {
                    myConsole.log("createTray ::: win32 click");
                });

                // only: mac & win
                tray.on("double-click", function() {
                    myConsole.log("createTray ::: win32 double-click");
                });

                // only: mac & win
                tray.on("right-click", function() {
                    myConsole.log("createTray ::: win32 right-click");
                });

                break;

            default:
                break;
        }

    });


    // Change to UnreadMessages Tray Icon
    //
    ipcMain.on("changeTrayIconToUnreadMessages", function() {
        tray.setImage(path.join(__dirname, "app/img/tray/64x64_tray_unread.png"));
    });

    // Change to Default Tray Icon
    //
    ipcMain.on("changeTrayIconToDefault", function() {
        tray.setImage(path.join(__dirname, "app/img/tray/64x64_tray_default.png"));
    });

}


// -----------------------------------------------------------------------------
// CHANGE USER AGENT
// -----------------------------------------------------------------------------
function changeUserAgent()
{
    // show out of the box default userAgent
    var defaultAgent = mainWindow.webContents.getUserAgent();
    myConsole.log("changeUserAgent ::: Default user agent is: " + defaultAgent);

    // change user agent of browser
    //
    // Windows:       Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36
    //                Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.78 Safari/537.36
    // Linux:         Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36
    //
    var userAgent = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36";
    mainWindow.webContents.setUserAgent(userAgent);

    // check if setting the userAgent worked
    var newAgent = mainWindow.webContents.getUserAgent();
    myConsole.log("changeUserAgent ::: Changed user agent to: " + newAgent);
}





// -----------------------------------------------------------------------------
// LETS GO
// -----------------------------------------------------------------------------

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Force single-app-instance
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


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
//
app.on("ready", createWindow);



// Quit when all windows are closed.
app.on("window-all-closed", function ()
{
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin")
    {
        app.quit();
    }
});


app.on("activate", function ()
{
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null)
    {
        createWindow();
    }
});


// create the tray
createTray();

// Measuring startup
console.timeEnd("init");
