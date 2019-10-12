const { app, BrowserWindow, Menu, ipcMain} = require("electron");

const openAboutWindow = require("about-window").default; // for: about-window
const path = require("path"); // needed for about-window
const shell = require("electron").shell; // for: opening external urls in default browser


/**
* @name createMenu
* @summary Creates the menu
* @description Creates the menu and auto-hides it on init
*/
exports.createMenu = 
function ()
{
    // Create a custom menu
    var menu = Menu.buildFromTemplate([

    // Menu: File
    {
        label: "File",
        submenu: [
        {
            label: "Settings",
            click(item, mainWindow) {
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
            click(item, mainWindow) {
                mainWindow.webContents.send("nextTab");
            },
            accelerator: "CmdOrCtrl+right"
        },
        {
            label: "Previous Service",
            click(item, mainWindow) {
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
            click(item, mainWindow) {
                mainWindow.reload();
            },
            accelerator: "CmdOrCtrl+R"
        },
        {
            label: "Reload current service",
            click(item, mainWindow) {
                mainWindow.webContents.send("reloadCurrentService", "whoooooooh!");
            },
            accelerator: "CmdOrCtrl+S",
            enabled: true
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
            click(item, mainWindow) {
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
            click(item, mainWindow) {
                mainWindow.hide();
                //mainWindow.reload();
            },
            accelerator: "CmdOrCtrl+H",
            enabled: true
        },
        {
            role: "minimize",
            label: "Minimize",
            click(item, mainWindow) {
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
            click(item, mainWindow) {
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
        // open changelog
        {
            label: "Changelog",
            click() {
                shell.openExternal("https://github.com/yafp/ttth/blob/master/docs/CHANGELOG.md");
            },
            accelerator: "F3"
        },
        // open FAQ
        {
            label: "FAQ",
            click() {
                shell.openExternal("https://github.com/yafp/ttth/blob/master/docs/FAQ.md");
            },
            accelerator: "F4"
        },
        {
            type: "separator"
        },
        // Update
        {
            label: "Search updates",
            click(item, mainWindow) {
                //mainWindow.webContents.toggleDevTools();
                mainWindow.webContents.send("startSearchUpdates");
            },
            enabled: true,
            //accelerator: "F12"
            accelerator: "F5"
        },
        {
            type: "separator"
        },
        // Console
        {
            id: "HelpConsole",
            label: "Console",
            click(item, mainWindow) {
                mainWindow.webContents.toggleDevTools();
            },
            enabled: true,
            accelerator: "F12"
        },
        {
            type: "separator"
        },
        // SubMenu of help
        {
            label: "Maintenance",
            submenu: [
            // Clear cache
            {
                id: "ClearCache",
                label: "Clear cache",
                click(item, mainWindow) {
                    const fs = require("fs");

                    var chromeCacheDir = path.join(app.getPath("userData"), "Cache"); 
                    if(fs.existsSync(chromeCacheDir)) {
                        var files = fs.readdirSync(chromeCacheDir);
                        for(var i=0; i<files.length; i++) {
                            var filename = path.join(chromeCacheDir, files[i]);
                            if(fs.existsSync(filename)) {
                                try {
                                    fs.unlinkSync(filename);
                                }
                                catch(e) {
                                    console.log(e);
                                }
                            }
                        }
                    }


                    mainWindow.reload();
                },
                enabled: true
            }
            ]
        }
        ]
    }
    ]);


    // use the menu
    Menu.setApplicationMenu(menu);


    // Disable some menu-elements - depending on the platform
    //
    var os = require("os");
    Menu.getApplicationMenu().items; // all the items

    // macos specific 
    
    if(os.platform() === "darwin") 
    {
        // see #21 - disable the menuitem Toggle-menubar
        //var item = Menu.getApplicationMenu().getMenuItemById("ViewToggleMenubar");
        //item.enabled = false;
    }
    

    // linux  specific 
    if(os.platform() === "linux") 
    {
        // nothing to do so far
    }

    // windows specific 
    if(os.platform() === "windows") 
    {
        // nothing to do so far
    }

};

