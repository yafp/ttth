/**
* @file Contains all main code
* @author yafp
* @namespace main
*/

'use strict'

// -----------------------------------------------------------------------------
// REQUIRE: 3rd PARTY
// -----------------------------------------------------------------------------
const { app, BrowserWindow, Menu, Tray, ipcMain, globalShortcut } = require('electron')
const shell = require('electron').shell // for: opening external urls in default browser
const isOnline = require('is-online') // for online connectivity checks
const path = require('path')
const fs = require('fs')
const os = require('os') // for: check os.platform()
const openAboutWindow = require('about-window').default // for: about-window
require('v8-compile-cache') // via: https://dev.to/xxczaki/how-to-make-your-electron-app-faster-4ifb

// -----------------------------------------------------------------------------
// Shared object
// -----------------------------------------------------------------------------
//
const consoleOutput = false // can be changed using --verbose

// Settings Tab
const settingDefaultView = ''
const settingTheme = 'default'
const settingAutostart = ''
const settingDisableTray = false
const settingUrgentWindow = false
const settingEnableErrorReporting = true
const settingEnablePrereleases = false

global.sharedObj = {
    // verbose mode aka console Output
    consoleOutput: consoleOutput,

    // settings
    settingDefaultView: settingDefaultView,
    settingTheme: settingTheme,
    settingAutostart: settingAutostart,
    settingDisableTray: settingDisableTray,
    settingUrgentWindow: settingUrgentWindow,
    settingEnableErrorReporting: settingEnableErrorReporting,
    settingEnablePrereleases: settingEnablePrereleases
}

// ----------------------------------------------------------------------------
// REQUIRE: TTTH MODULES
// ----------------------------------------------------------------------------
const urls = require('./app/js/ttth/modules/urlsGithub.js') // the github urls
const crash = require('./app/js/ttth/modules/crashReporter.js') // crashReporter
const sentry = require('./app/js/ttth/modules/sentry.js') // sentry
const unhandled = require('./app/js/ttth/modules/unhandled.js') // electron-unhandled

// ----------------------------------------------------------------------------
// COMMAND-LINE-ARGS
// ----------------------------------------------------------------------------
const yargs = require('yargs')
    .strict(true) // arguments must be valid
    .usage('Usage: $0 <command> [options]')
    // define arguments
    .option('gpu', {
        alias: 'g',
        type: 'boolean',
        description: 'Starts ttth with gpu-acceleration enabled'
    })
    .option('verbose', {
        alias: 'v',
        type: 'boolean',
        description: 'Starts ttth with verbose output'
    })
    .option('help', {
        alias: 'h',
        type: 'boolean',
        description: 'Shows the ttth help'
    })
    .option('version', {
        type: 'boolean',
        description: 'Shows the ttth version'
    })

    // displayed in case of invalid parameters
    .showHelpOnFail(false, 'Specify --help to display the available options')

    // show the project url
    .epilog('Project URL: https://github.com/yafp/ttth')

    // Show an example
    // .example('$0 --help', 'Shows the media-dupes help')
    .argv

if (yargs.verbose === true) {
    global.sharedObj.consoleOutput = true // update the global object
}

// # 188
if (yargs.gpu === true) {
    // nothing to do here as it is enabled by default
    // writeLog('info', 'GPU acceleration is now enabled')

} else {
    app.disableHardwareAcceleration() // https://www.electronjs.org/docs/api/app#appdisablehardwareacceleration
    // writeLog('info', 'GPU acceleration is now disabled')
}

// ----------------------------------------------------------------------------
// ERROR-HANDLING:
// ----------------------------------------------------------------------------
crash.initCrashReporter()
unhandled.initUnhandled()
sentry.enableSentry() // sentry is enabled by default

// ----------------------------------------------------------------------------
// HARDWARE ACCELERATION:
// ----------------------------------------------------------------------------
// #188 - added in 1.9.0
// for testing use: --disable-gpu
//
// Disables hardware acceleration for current app. This method can only be called before app is ready.
// app.disableHardwareAcceleration() // https://www.electronjs.org/docs/api/app#appdisablehardwareacceleration

// var foo = app.getAppMetrics()
// console.error(foo)

// -----------------------------------------------------------------------------
// VARIABLES
// -----------------------------------------------------------------------------

// Keep a global reference of the window objects, if you don't, the window
// will be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null
let configWindow = null
// let windowConfig = null // gonna implement this in 1.10.0

const gotTheLock = app.requestSingleInstanceLock() // for: single-instance handling
const defaultUserDataPath = app.getPath('userData') // for: storing window position and size
const userOSPlatform = os.platform() // for BadgeCount support - see #152

const defaultMainWindowWidth = 800
const defaultMainWindowHeight = 600

// -----------------------------------------------------------------------------
// FUNCTIONS
// -----------------------------------------------------------------------------

/**
* @function writeLog
* @summary Writes console output for the main process
* @description Writes console output for the main process
* @memberof main
* @param {string} type - The log type
* @param {string} message - The log message
* @param {string} optionalObject - An optional object which might contain additional informations
*/
function writeLog (type, message, optionalObject = '') {
    const logM = require('electron-log')
    const prefix = '[   Main   ] '

    if (global.sharedObj.consoleOutput === false) {
        logM.transports.console.level = false // disable Terminal output. Still logs to DevTools and LogFile
    }
    // important: https://github.com/megahertz/electron-log/issues/189

    // electron-log can: error, warn, info, verbose, debug, silly
    switch (type) {
    case 'info':
        logM.info(prefix + message, optionalObject)
        break

    case 'warn':
        logM.warn(prefix + message, optionalObject)
        break

    case 'error':
        logM.error(prefix + message, optionalObject)
        break

    default:
        logM.silly(prefix + message, optionalObject)
        break
    }
}

/**
* @function checkNetworkConnectivity
* @summary Checks if internet is accessible
* @description Checks if the internet is accessible, if not triggers an error in the mainWindow
* @memberof main
*/
function checkNetworkConnectivity () {
    (async () => {
        if (await isOnline() === true) {
            writeLog('info', 'checkNetworkConnectivity ::: Got access to the internet.')
        } else {
            writeLog('error', 'checkNetworkConnectivity ::: Got NO access to the internet.')
            mainWindow.webContents.send('showNoConnectivityError') // app should show an error
        }
    })()
}

/**
* @function showDialog
* @summary Shows a dialog
* @description Displays a dialog - see https://electronjs.org/docs/api/dialog
* @memberof main
* @param {string} dialogType - Can be "none", "info", "error", "question" or "warning"
* @param {string} dialogTitle - The title text
* @param {string} dialogMessage - The message of the dialog
* @param {string} dialogDetail - The detail text
*/
function showDialog (dialogType, dialogTitle, dialogMessage, dialogDetail) {
    const { dialog } = require('electron')
    const options = {
        type: dialogType,
        buttons: ['OK'],
        defaultId: 2,
        title: dialogTitle,
        message: dialogMessage,
        detail: dialogDetail
    }

    dialog.showMessageBox(null, options, (response, checkboxChecked) => {
        // console.log(response);
    })
}

/**
* @function createTray
* @summary Creates the tray of the app
* @description Creates the tray and the related menu.
* @memberof main
*/
function createTray () {
    writeLog('info', 'createTray ::: Starting to create a tray item')

    let tray = null
    tray = new Tray(path.join(__dirname, 'app/img/tray/tray_default.png'))

    const contextMenu = Menu.buildFromTemplate([
        {
            // Window focus
            id: 'show',
            label: 'Show',
            click: function () {
                if (mainWindow === null) {
                    // #134
                    // do nothing, as no mainWindow exists. Most likely on macOS
                } else {
                    // focus the main window
                    if (mainWindow.isMinimized()) {
                        mainWindow.restore()
                    } else {
                        // is not minimized. Was maybe: hidden via hide()
                        mainWindow.show()
                    }
                    mainWindow.focus()
                }
            },
            enabled: true
        },
        {
            type: 'separator',
            enabled: false
        },
        {
            // Quit
            id: 'exit',
            label: 'Exit',
            enabled: true,
            click: function () {
                app.quit()
            }
        }
    ])

    tray.setToolTip('ttth')
    tray.setContextMenu(contextMenu)

    writeLog('info', 'createTray ::: Finished creating tray')

    // Call from renderer: Change Tray Icon to UnreadMessages
    ipcMain.on('changeTrayIconToUnreadMessages', function () {
        if (tray.isDestroyed() === false) {
            tray.setImage(path.join(__dirname, 'app/img/tray/tray_unread.png'))
        }
    })

    // Call from renderer: Change Tray Icon to Default
    ipcMain.on('changeTrayIconToDefault', function () {
        if (tray.isDestroyed() === false) {
            tray.setImage(path.join(__dirname, 'app/img/tray/tray_default.png'))
        }
    })

    // Call from renderer: Option: Urgent window - see #110
    ipcMain.on('makeWindowUrgent', function () {
        mainWindow.flashFrame(true) // #110 - urgent window
    })

    // Call from renderer: Option: DisableTray
    ipcMain.on('disableTray', function () {
        writeLog('info', 'ipcMain.disableTray ::: Disabling tray (ipcMain)')
        tray.destroy()
        if (tray.isDestroyed() === true) {
            writeLog('info', 'ipcMain.disableTray ::: Disabling tray was working')
        } else {
            writeLog('error', 'ipcMain.disableTray ::: Disabling tray failed')
        }
    })
}

/**
* @function createWindowConfig
* @summary Creates the config window  of the app
* @description Creates the config window
* @memberof main
*/
/*
function createWindowConfig () {
    writeLog('info', 'createWindow ::: Starting to create the application windows')

    // Create the browser window.
    windowConfig = new BrowserWindow({
        // parent: mainWindow,
        modal: true,
        frame: true, // false results in a borderless window. Needed for custom titlebar
        titleBarStyle: 'default', // needed for custom-electron-titlebar. See: https://electronjs.org/docs/api/frameless-window
        backgroundColor: '#ffffff',
        show: true,
        center: true, // Show window in the center of the screen
        width: 800,
        minWidth: 800,
        // resizable: false, // this conflickts with opening dev tools
        minimizable: false, // not implemented on linux
        maximizable: false, // not implemented on linux
        height: 700,
        minHeight: 700,
        icon: path.join(__dirname, 'app/img/icon/icon.png'),
        webPreferences: {
            nodeIntegration: true,
            webSecurity: true // introduced in 0.3.0
        }
    })

    // and load the setting.html of the app.
    windowConfig.loadFile('app/configWindow.html')

    // window needs no menu
    windowConfig.removeMenu()

    // Call from renderer: Settings UI - toggle dev tools
    ipcMain.on('settingsToggleDevTools', function () {
        settingsWindow.webContents.toggleDevTools()
    })

    // Emitted before the window is closed.
    windowConfig.on('close', function () {
        writeLog('info', 'createWindowConfig ::: windowConfig will close (event: close)')
    })

    // Emitted when the window is closed.
    windowConfig.on('closed', function (event) {
        writeLog('info', 'createWindowConfig ::: windowConfig is closed (event: closed)')
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        windowConfig = null

        // unblur main UI
        mainWindow.webContents.send('unblurMainUI')
    })
}
*/

/**
* @function createWindow
* @summary Creates the main window  of the app
* @description Creates the main window, restores window position and size of possible
* @memberof main
*/
function createWindow () {
    writeLog('info', 'createWindow ::: Starting to create the application windows')

    // Variables for window position and size
    let windowWidth
    let windowHeight
    let windowPositionX
    let windowPositionY

    // Try to read stored last window position and size
    const customUserDataPath = path.join(defaultUserDataPath, 'ttthMainWindowPosSize.json')
    let data
    try {
        data = JSON.parse(fs.readFileSync(customUserDataPath, 'utf8'))

        // size
        windowWidth = data.bounds.width
        windowHeight = data.bounds.height

        // position
        windowPositionX = data.bounds.x
        windowPositionY = data.bounds.y

        writeLog('info', 'createWindow ::: Got last window position and size information from _' + customUserDataPath + '_.')
    } catch (e) {
        writeLog('warn', 'createWindow ::: No last window position and size information found in _' + customUserDataPath + '_. Using fallback values')

        // set some default values for window size
        windowWidth = defaultMainWindowWidth
        windowHeight = defaultMainWindowHeight
    }

    // Create the browser window.
    mainWindow = new BrowserWindow({
        // title: '${productName}',
        frame: false, // false results in a borderless window
        show: false, // hide until: ready-to-show
        titleBarStyle: 'hidden', // needed for custom-electron-titlebar
        width: windowWidth,
        height: windowHeight,
        minWidth: defaultMainWindowWidth,
        minHeight: defaultMainWindowHeight,
        center: true, // Show window in the center of the screen. (since 1.7.0)
        backgroundColor: '#ffffff',
        icon: path.join(__dirname, 'app/img/icon/icon.png'),
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true,
            webSecurity: true, // introduced in 1.8.0
            experimentalFeatures: false, // introduced in 1.8.0
            webviewTag: true, // # see #37
            devTools: true, // should be possible to open them
            partition: 'ttth'
        }
    })

    writeLog('info', 'createWindow ::: Finished creating the mainWindow')

    // Restore window position if possible
    // requirements: found values in .ttthMainWindowPosSize.json from the previous session
    //
    if ((typeof windowPositionX !== 'undefined') && (typeof windowPositionY !== 'undefined')) {
        writeLog('info', 'createWindow ::: Restoring last stored window-position of mainWindow')
        mainWindow.setPosition(windowPositionX, windowPositionY)
    }

    // Call from renderer: Update property from globalObj
    ipcMain.on('globalObjectSet', function (event, property, value) {
        writeLog('info', 'ipcMain.globalObjectSet ::: Set property _' + property + '_ to new value: _' + value + '_')
        global.sharedObj[property] = value
        writeLog('info', 'ipcMain.globalObjectSet ::: sharedObj: ', global.sharedObj)
    })

    // Load the UI (mainWindow.html) of the app.
    mainWindow.loadFile('./app/mainWindow.html')
    writeLog('info', 'createWindow ::: Loading mainWindow.html to mainWindow')

    // show the formerly hidden main window as it is fully ready now
    mainWindow.on('ready-to-show', function () {
        mainWindow.show()
        mainWindow.focus()
        writeLog('info', 'mainWindow.on.ready-to-show ::: mainWindow is now ready, so show it and then focus it')

        checkNetworkConnectivity() // check network access
    })

    // Emitted when the application has finished basic startup.
    mainWindow.on('will-finish-launching', function () {
        writeLog('info', 'mainWindow.on.will-finish-launching ::: mainWindow will finish launching')
    })

    // When dom is ready
    mainWindow.webContents.once('dom-ready', () => {
        writeLog('info', 'mainWindow.on.ready ::: mainwWindow DOM is now ready')
    })

    // When page title gets changed
    mainWindow.webContents.once('page-title-updated', () => {
        writeLog('info', 'mainWindow.on.page-title-updated ::: mainWindow got new title')
    })

    // when the app is shown
    mainWindow.on('show', function () {
        writeLog('info', 'mainWindow.on.show ::: mainWindow is visible')
    })

    // when the app loses focus / aka blur
    mainWindow.on('blur', function () {
        writeLog('info', 'mainWindow.on.blur ::: mainWindow lost focus')
    })

    // when the app gets focus
    mainWindow.on('focus', function () {
        writeLog('info', 'mainWindow.on.focus ::: mainWindow got focus')
    })

    // when the app goes fullscreen
    mainWindow.on('enter-full-screen', function () {
        writeLog('info', 'mainWindow.on.enter-full-screen ::: mainWindow is now in fullscreen')
    })

    // when the app goes leaves fullscreen
    mainWindow.on('leave-full-screen', function () {
        // disabled to reduce clutter
    })

    // when the app gets resized
    mainWindow.on('resize', function () {
        // disabled to reduce clutter
    })

    // when the app gets hidden
    mainWindow.on('hide', function () {
        writeLog('info', 'mainWindow.on.hide ::: mainWindow is now hidden')
    })

    // when the app gets maximized
    mainWindow.on('maximize', function () {
        writeLog('info', 'mainWindow.on.maximize ::: mainWindow is now maximized')
    })

    // when the app gets unmaximized
    mainWindow.on('unmaximize', function () {
        writeLog('info', 'mainWindow.on.unmaximize ::: mainWindow is now unmaximized')
    })

    // when the app gets minimized
    mainWindow.on('minimize', function () {
        writeLog('info', 'mainWindow.on.minimize ::: mainWindow is now minimized')
    })

    // when the app gets restored from minimized mode
    mainWindow.on('restore', function () {
        writeLog('info', 'mainWindow.on.restore ::: mainWindow is now restored')
    })

    mainWindow.on('app-command', function () {
        writeLog('info', 'mainWindow.on.app-command ::: mainWindow got app-command')
    })

    // Emitted before the window is closed.
    mainWindow.on('close', function () {
        writeLog('info', 'mainWindow.on.close ::: mainWindow will close')

        // get current window position and size
        const data = {
            bounds: mainWindow.getBounds()
        }

        // define target path (in user data) to store rthe values
        const customUserDataPath = path.join(defaultUserDataPath, 'ttthMainWindowPosSize.json')

        // try to write the window position and size to preference file
        fs.writeFile(customUserDataPath, JSON.stringify(data), function (error) {
            if (error) {
                writeLog('error', 'mainWindow.on.close ::: storing window-position and -size of mainWindow in  _' + customUserDataPath + '_ failed with error: _' + error + '_.')
                writeLog('error', 'mainWindow.on.close ::: Error: ', error)
                return console.log(error)
            }

            writeLog('info', 'mainWindow.on.close ::: Successfully stored window-position and -size in _' + customUserDataPath + '_.')
        })
    })

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
        writeLog('info', 'mainWindow.on.closed ::: mainWindow is now closed')
    })

    // When the app is unresponsive
    mainWindow.on('unresponsive', function () {
        writeLog('error', 'mainWindow.on.unresponsive ::: mainWindow is now unresponsive')
        showDialog('error', 'Alert', 'ttth seems unresponsive', 'Consider restarting the app')
    })

    // When the app gets responsive again
    mainWindow.on('responsive', function () {
        writeLog('info', 'mainWindow.on.responsive ::: mainWindow is now responsive again')
    })

    // When the app is crashed
    mainWindow.webContents.on('crashed', function () {
        writeLog('info', 'mainWindow.on.crashed ::: mainWindow crashed')
        showDialog('error', 'Alert', 'ttth just crashed', 'Consider reporting this issue')
    })

    // Call from renderer: Reload mainWindow
    ipcMain.on('reloadMainWindow', (event) => {
        mainWindow.reload()
        writeLog('info', 'ipcMain.reloadMainWindow ::: mainWindow is now reloaded (ipcMain)')
    })

    // Call from renderer: Open folder with user configured services
    ipcMain.on('openUserServicesConfigFolder', (event) => {
        const customUserDataPath = path.join(defaultUserDataPath, 'storage')
        if (shell.openPath(customUserDataPath) === true) {
            writeLog('info', 'ipcMain.openUserServicesConfigFolder ::: ServiceConfigs: Opened the folder _' + customUserDataPath + '_ which contains all user-configured services')
        } else {
            writeLog('warn', 'ipcMain.openUserServicesConfigFolder  ::: ServiceConfigs: Failed to open the folder _' + customUserDataPath + '_ (which contains all user-configured services).')
        }
    })

    // Call from renderer: Open folder with user settings
    ipcMain.on('openUserSettingsConfigFolder', (event) => {
        const customUserDataPath = path.join(defaultUserDataPath, 'ttthUserSettings')
        if (shell.openPath(customUserDataPath) === true) {
            writeLog('info', 'ipcMain.openUserSettingsConfigFolder ::: UserSettings: Opened the folder _' + customUserDataPath + '_ which contains all user-configured services')
        } else {
            writeLog('warn', 'ipcMain.openUserSettingsConfigFolder ::: UserSettings: Failed to open the folder _' + customUserDataPath + '_ (which contains all user-configured services).')
        }
    })

    // Call from renderer ::: deleteAllGlobalServicesShortcut
    ipcMain.on('deleteAllGlobalServicesShortcut', function (arg1, numberOfEnabledServices) {
        globalShortcut.unregisterAll() // doesnt work - whyever
        writeLog('info', 'ipcMain.deleteAllGlobalServicesShortcut ::: Shortcuts: Deleting all global service shortcut at once.')

        // delete all global shortcuts manually
        /*
        var i;
        for (i = 1; i <= numberOfEnabledServices;  i++)
        {
            globalShortcut.unregister("CmdOrCtrl+" + i);
            writeLog("info", "createWindow ::: Shortcuts: Deleting the global service shortcut: CmdOrCtrl+" + i);
        }
        */
        writeLog('info', 'ipcMain.deleteAllGlobalServicesShortcut ::: Shortcuts: Finished deleting all global service shortcuts')
    })

    // Call from renderer ::: createNewGlobalShortcut
    ipcMain.on('createNewGlobalShortcut', function (arg1, shortcut, targetTab) {
        writeLog('info', 'ipcMain.createNewGlobalShortcut ::: Shortcuts: Creating a new shortcut: _' + shortcut + '_ for the service/tab: _' + targetTab + '_.')

        // const ret = globalShortcut.register(shortcut, () => {
        globalShortcut.register(shortcut, () => {
            writeLog('error', 'Shortcut: _' + shortcut + '_ was pressed.')
            mainWindow.webContents.send('switchToTab', targetTab) // activate the related tab
        })
    })

    // Call from renderer: should ttth update the app badge count
    // is supported for macOS & Linux (running Unity)
    ipcMain.on('updateBadgeCount', (event, arg) => {
        let environmentSupported = false

        // Possible values are 'aix', 'darwin', 'freebsd', 'linux', 'openbsd', 'sunos', and 'win32'.
        switch (userOSPlatform) {
        case 'darwin':
            environmentSupported = true
            break

        case 'linux':
            const checkForUnity = app.isUnityRunning()
            if (checkForUnity === true) {
                environmentSupported = true
            }
            break

        default:
                // do nothing
        }

        // if the environment supports BadgeCount - update it
        if (environmentSupported === true) {
            // temporary hack - cause of #182
            if (Number.isNaN(arg)) {
                writeLog('warn', 'ipcMain.updateBadgeCount ::: Returned value is not a number (NaN). Falling back to value 0') // updating badge count worked
                arg = 0 // set a fallback value - see #182
            }

            const currentBadgeCount = app.getBadgeCount() // get the  current badge count
            // FIXME: deprecated - Please use 'badgeCount property' instead.

            // if badge count has to be updated - try to update it
            if (currentBadgeCount !== arg) {
                const didUpdateBadgeCount = app.setBadgeCount(arg) // FIXME: deprecated.- Please use 'badgeCount property' instead.
                if (didUpdateBadgeCount === true) {
                    writeLog('info', 'ipcMain.updateBadgeCount ::: Updating application badge count to _' + arg + '_.') // updating badge count worked
                } else {
                    writeLog('warn', 'ipcMain.updateBadgeCount ::: Updating application badge count to _' + arg + '_ failed.') // updating badge count failed
                }
            }
        }
    })

    // *****************************************************************
    // modal window: to allow creating and configuring a single service
    // *****************************************************************
    //
    configWindow = new BrowserWindow({
        parent: mainWindow,
        modal: true, // Whether this is a modal window. This only works when the window is a child window
        // title: '${productName}',
        frame: false, // false results in a borderless window
        show: false, // hide as default
        titleBarStyle: 'hidden',
        resizable: false,
        width: 600,
        height: 650,
        minWidth: 600,
        minHeight: 650,
        backgroundColor: '#ffffff',
        icon: path.join(__dirname, 'app/img/icon/icon.png'),
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true,
            webviewTag: true // see #37
        }
    })

    writeLog('info', 'createWindow ::: Finished creating configWindow')

    // load html form to the window
    configWindow.loadFile('app/configWindow.html')
    writeLog('info', 'createWindow ::: Loaded configWindow.html to configWindow')

    // hide menubar
    configWindow.setMenuBarVisibility(false)
    writeLog('info', 'createWindow ::: Hiding menubar of configWindow')

    // Emitted when the window gets a close event.(close VS closed)
    configWindow.on('close', function (event) {
        writeLog('info', 'configWindow will close, but we hide it (event: close)')
        configWindow.hide() // just hide it - so it can re-opened
    })

    // Emitted when the window is ready to be shown
    configWindow.on('ready-to-show', function (event) {
        writeLog('info', 'configWindow is now ready to show (event: ready-to-show)')

        // do some checks & routines once at start of the application
        mainWindow.webContents.send('startSearchUpdatesSilent') // search silently for ttth updates
    })

    // Emitted when the window is shown
    configWindow.on('show', function (event) {
        writeLog('info', 'configWindow is now shown (event: show)')
    })

    // Call from renderer: show configure-single-service window for a new service
    ipcMain.on('showConfigureSingleServiceWindowNew', (event, arg) => {
        writeLog('info', 'ipcMain.showConfigureSingleServiceWindowNew ::: configWindow preparing for new service creation')
        configWindow.show() // show window
        configWindow.webContents.send('serviceToCreate', arg)
    })

    // Call from renderer: show configure-single-service window
    ipcMain.on('showConfigureSingleServiceWindow', (event, arg) => {
        writeLog('info', 'ipcMain.showConfigureSingleServiceWindow ::: configWindow preparing for service editing')
        configWindow.show() // show window
        configWindow.webContents.send('serviceToConfigure', arg)
    })

    // Call from renderer: hide configure-single-service window
    ipcMain.on('closeConfigureSingleServiceWindow', (event) => {
        configWindow.hide() // hide window
        writeLog('info', 'ipcMain.closeConfigureSingleServiceWindow ::: configWindow is now hidden')
    })

    // Call from renderer: Tray: RecreateTray
    ipcMain.on('recreateTray', function () {
        writeLog('info', 'ipcMain.recreateTray ::: Recreating tray')
        createTray()
    })

    writeLog('info', 'createWindow ::: Finished creating mainWindow and configWindow')
}

/**
* @function forceSingleAppInstance
* @summary Takes care that there is only 1 instance of this app running
* @description Takes care that there is only 1 instance of this app running
* @memberof main
*/
function forceSingleAppInstance () {
    writeLog('info', 'forceSingleAppInstance ::: Checking if there is only 1 instance of ttth')

    if (!gotTheLock) {
        writeLog('error', 'forceSingleAppInstance ::: There is already another instance of ttth')
        app.quit() // quit the second instance
    } else {
        app.on('second-instance', (event, commandLine, workingDirectory) => {
            // Someone tried to run a second instance, we should focus our first instance window.
            if (mainWindow) {
                // #134
                /*
                if (mainWindow === null) {
                    // do nothing - there is no mainwindow - most likely we are on macOS
                } else {
                    // mainWindow exists
                    if (mainWindow.isMinimized()) {
                        mainWindow.restore()
                    }
                    mainWindow.focus()
                }
                */
                // simplify:
                // mainWindow exists
                if (mainWindow.isMinimized()) {
                    mainWindow.restore()
                }
                mainWindow.focus()
            }
        })
    }
}

/**
* @function createMenu
* @summary Creates the application menu
* @description Creates the application menu
* @memberof main
*/
function createMenu () {
    // Create a custom menu
    const menu = Menu.buildFromTemplate([

        // Menu: File
        {
            label: 'File',
            submenu: [
                // Settings
                {
                    label: 'Settings',
                    click (item, mainWindow) {
                        mainWindow.webContents.send('showSettings')
                    },
                    accelerator: 'CmdOrCtrl+,'
                },
                // Separator
                {
                    type: 'separator'
                },
                // Exit
                {
                    role: 'quit',
                    label: 'Exit',
                    click () {
                        app.quit()
                    },
                    accelerator: 'CmdOrCtrl+Q'
                }
            ]
        },

        // Menu: Edit
        {
            label: 'Edit',
            submenu: [
                {
                    label: 'Undo',
                    accelerator: 'CmdOrCtrl+Z',
                    selector: 'undo:'
                },
                {
                    label: 'Redo',
                    accelerator: 'Shift+CmdOrCtrl+Z',
                    selector: 'redo:'
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Cut',
                    accelerator: 'CmdOrCtrl+X',
                    selector: 'cut:'
                },
                {
                    label: 'Copy',
                    accelerator: 'CmdOrCtrl+C',
                    selector: 'copy:'
                },
                {
                    label: 'Paste',
                    accelerator: 'CmdOrCtrl+V',
                    selector: 'paste:'
                },
                {
                    label: 'Select All',
                    accelerator: 'CmdOrCtrl+A',
                    selector: 'selectAll:'
                }
            ]
        },

        // Menu: View
        {
            label: 'View',
            submenu: [
                {
                    label: 'Next Service',
                    click (item, mainWindow) {
                        mainWindow.webContents.send('nextTab')
                    },
                    accelerator: 'CmdOrCtrl+right'
                },
                {
                    label: 'Previous Service',
                    click (item, mainWindow) {
                        mainWindow.webContents.send('previousTab')
                    },
                    accelerator: 'CmdOrCtrl+left'
                },
                {
                    type: 'separator'
                },
                {
                    role: 'reload',
                    label: 'Reload',
                    click (item, mainWindow) {
                        mainWindow.reload()
                    },
                    accelerator: 'CmdOrCtrl+R'
                },
                {
                    label: 'Reload current service',
                    click (item, mainWindow) {
                        mainWindow.webContents.send('reloadCurrentService')
                    },
                    accelerator: 'CmdOrCtrl+S',
                    enabled: true
                }
            ]
        },

        // Menu: Window
        {
            label: 'Window',
            submenu: [
                {
                    role: 'togglefullscreen',
                    label: 'Toggle Fullscreen',
                    click (item, mainWindow) {
                        if (mainWindow.isFullScreen()) {
                            mainWindow.setFullScreen(false)
                        } else {
                            mainWindow.setFullScreen(true)
                        }
                    },
                    accelerator: 'F11' // is most likely predefined on osx - results in: doesnt work on osx
                },
                {
                    role: 'hide',
                    label: 'Hide',
                    click (item, mainWindow) {
                        mainWindow.hide()
                        // mainWindow.reload();
                    },
                    accelerator: 'CmdOrCtrl+H',
                    enabled: true
                },
                {
                    role: 'minimize',
                    label: 'Minimize',
                    click (item, mainWindow) {
                        if (mainWindow.isMinimized()) {
                            // mainWindow.restore();
                        } else {
                            mainWindow.minimize()
                        }
                    },
                    accelerator: 'CmdOrCtrl+M'
                },
                {
                    label: 'Maximize',
                    click (item, mainWindow) {
                        if (mainWindow.isMaximized()) {
                            mainWindow.unmaximize()
                        } else {
                            mainWindow.maximize()
                        }
                    },
                    accelerator: 'CmdOrCtrl+K'
                }
            ]
        },

        // Menu: Help
        {
            role: 'help',
            label: 'Help',
            submenu: [
                // About
                {
                    // role: 'about', - see: https://github.com/rhysd/electron-about-window/issues/59
                    label: 'About',
                    click () {
                        openAboutWindow({
                            icon_path: path.join(__dirname, 'app/img/about/icon_about.png'),
                            open_devtools: false,
                            use_version_info: true,
                            win_options: // https://github.com/electron/electron/blob/master/docs/api/browser-window.md#new-browserwindowoptions
                    {
                        autoHideMenuBar: true,
                        titleBarStyle: 'hidden',
                        minimizable: false, // not implemented on linux
                        maximizable: false, // not implemented on linux
                        movable: false, // not implemented on linux
                        resizable: false,
                        alwaysOnTop: true,
                        fullscreenable: false,
                        skipTaskbar: false
                    }
                        })
                    }
                },
                // open homepage
                {
                    label: 'Homepage',
                    click () {
                        shell.openExternal(urls.urlGitHubGeneral)
                    },
                    accelerator: 'F1'
                },
                // report issue
                {
                    label: 'Report issue',
                    click () {
                        shell.openExternal(urls.urlGitHubIssues)
                    },
                    accelerator: 'F2'
                },
                // open changelog
                {
                    label: 'Changelog',
                    click () {
                        shell.openExternal(urls.urlGitHubChangelog)
                    },
                    accelerator: 'F3'
                },
                // open FAQ
                {
                    label: 'FAQ',
                    click () {
                        shell.openExternal(urls.urlGitHubFAQ)
                    },
                    accelerator: 'F4'
                },
                // open Releases
                {
                    label: 'Releases',
                    click () {
                        shell.openExternal(urls.urlGitHubReleases)
                    },
                    accelerator: 'F5'
                },
                {
                    type: 'separator'
                },
                // Update
                {
                    label: 'Search updates',
                    click (item, mainWindow) {
                        mainWindow.webContents.send('startSearchUpdates')
                    },
                    enabled: true,
                    accelerator: 'F9'
                },
                {
                    type: 'separator'
                },

                // SubMenu Console
                {
                    label: 'Console',
                    submenu: [
                        // console for current service
                        {
                            id: 'HelpConsoleCurrentService',
                            label: 'Console for current service',
                            click (item, mainWindow) {
                                mainWindow.webContents.send('openDevToolForCurrentService')
                            },
                            enabled: true,
                            accelerator: 'F10'
                        },
                        // Console
                        {
                            id: 'HelpConsole',
                            label: 'Console',
                            click (item, mainWindow) {
                                mainWindow.webContents.toggleDevTools()
                            },
                            enabled: true,
                            accelerator: 'F12'
                        }
                    ]
                },
                {
                    type: 'separator'
                },
                // SubMenu of help
                {
                    label: 'Maintenance',
                    submenu: [
                        // Clear cache in userData
                        {
                            id: 'ClearCache',
                            label: 'Clear cache',
                            click (item, mainWindow) {
                                const chromeCacheDir = path.join(app.getPath('userData'), 'Cache')
                                if (fs.existsSync(chromeCacheDir)) {
                                    const files = fs.readdirSync(chromeCacheDir)
                                    for (let i = 0; i < files.length; i++) {
                                        const filename = path.join(chromeCacheDir, files[i])
                                        if (fs.existsSync(filename)) {
                                            try {
                                                fs.unlinkSync(filename)
                                            } catch (error) {
                                                console.log(error)
                                            }
                                        }
                                    }
                                }

                                mainWindow.reload()
                            },
                            enabled: true
                        }
                    ]
                }
            ]
        }
    ])

    // use the menu
    Menu.setApplicationMenu(menu)

    // OPTIONAL & currently not in use:
    //
    // Disable some menu-elements - depending on the platform
    //
    /*
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
    */
}

// -----------------------------------------------------------------------------
// LETS GO
// -----------------------------------------------------------------------------

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
//
app.on('ready', function () {
    writeLog('info', 'app got ready signal (event: ready)')
    forceSingleAppInstance() // check for single instance
    createWindow() // create the application UI
    createMenu() // create the application menu
    createTray() // create the tray
})

// Emitted while app tries to do a basic auth (https://electronjs.org/docs/api/app#event-login)
app.on('login', function () {
    writeLog('info', 'app tries to do basic auth (event: login)')
})

// Emitted before the application starts closing its windows.
app.on('before-quit', function () {
    writeLog('info', 'app is preparing to quit (event: before-quit)')
})

// Emitted when all windows have been closed and the application will quit.
app.on('will-quit', function () {
    writeLog('info', 'app will quit (event: will-quit)')
})

// Emitted when the application is quitting.
app.on('quit', function () {
    writeLog('info', 'app got quit event (event: quit)')
})

// Emitted when a browserWindow gets blurred. (loosing focus)
app.on('browser-window-blur', function () {
    // writeLog("info", "app lost focus (event: browser-window-blur)");
})

// Emitted when a browserWindow gets focused.
app.on('browser-window-focus', function () {
    // disabled to reduce clutter
    // writeLog("info", "app got focus (event: browser-window-focus)");
})

// Emitted when failed to verify the certificate for url, to trust the certificate you should prevent the default behavior with event.preventDefault() and call callback(true).
app.on('certificate-error', function () {
    writeLog('info', 'app failed to verify a cert (event: certificate-error)')
})

// Emitted when remote.require() is called in the renderer process of webContents.
app.on('remote-require', function () {
    writeLog('info', 'app called .require() in the renderer process (event: remote-require)')
})

// Emitted when remote.getGlobal() is called in the renderer process of webContents.
app.on('remote-get-global', function () {
    // writeLog("info", "app called .getGlobal() in the renderer process (event: remote-get-global)");
})

// Emitted when remote.getBuiltin() is called in the renderer process of webContents.
app.on('remote-get-builtin', function () {
    // disabled to reduce clutter
    // writeLog("info", "app called .getBuiltin() in the renderer process (event: remote-get-builtin)");
})

// Emitted when remote.getCurrentWindow() is called in the renderer process of webContents.
app.on('remote-get-current-window', function () {
    // writeLog("info", "app called .getCurrentWindow() in the renderer process(event: remote-get-current-window)");
})

// Emitted when remote.getCurrentWebContents() is called in the renderer process of webContents
app.on('remote-get-current-web-contents', function () {
    writeLog('info', 'app called .getCurrentWebContents() in the renderer process (event: remote-get-current-web-contents)')
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    writeLog('info', 'app closed all application windows (event: window-all-closed)')

    // On macOS it is common for applications and their menu bar to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        writeLog('info', 'Bye')
        app.quit()
    }

    // we handle all systemes the same - this means: close the mainWindow = the app closes as well -  why: see #134
    // writeLog("info", "Bye");
    // app.quit();
})

// activate = macOS only:
// Emitted when the application is activated. Various actions can trigger this event, such as launching the application for the first time,
// attempting to re-launch the application when it's already running, or clicking on the application's dock or taskbar icon.
app.on('activate', function () {
    writeLog('info', 'app got activate event (event: activate)')

    // On macOS it's common to re-create a window in the app when the dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        writeLog('warn', 'Trying to re-create the mainWindow, as it doesnt exist anymore (event: activate)')
        createWindow()
    }
})

// Emitted when a new webContents is created.
// Try to set some values while creating new webviews. See: https://electronjs.org/docs/tutorial/security
app.on('web-contents-created', (event, contents) => {
    contents.on('will-attach-webview', (event, webPreferences, params) => {
        writeLog('info', 'app will attach new webview with target url set to: _' + params.src + '_.')

        // Strip away preload scripts if unused or verify their location is legitimate
        //
        // delete webPreferences.preload
        // delete webPreferences.preloadURL

        // Disable Node.js integration
        webPreferences.nodeIntegration = false

    // Verify URL being loaded
    //
    // if (!params.src.startsWith('https://example.com/'))
    // {
        // event.preventDefault()
    // }
    })
})

// Emitted when a new browserWindow is created.
app.on('browser-window-created', function () {
    writeLog('info', 'app created a browser window (event: browser-window-created)')
})

// Emitted when the application has finished basic startup.
app.on('will-finish-launching', function () {
    writeLog('info', 'app will finish launching (event: will-finish-launching)')
})

// Emitted when the renderer process of webContents crashes or is killed.
app.on('renderer-process-crashed', function (event, webContents, killed) {
    writeLog('error', 'app is realizing a crashed renderer process (event: renderer-process-crashed)')
    writeLog('error', 'Event: ', event)
    writeLog('error', 'webContents: ', webContents)
    writeLog('error', 'killed: ', killed)
})

// Emitted when the GPU process crashes or is killed.
app.on('gpu-process-crashed', function () {
    writeLog('error', 'app is realizing a crashed gpu process (event: gpu-process-crashed)')
})

// Emitted whenever there is a GPU info update.
app.on('gpu-info-update', function () {
    writeLog('info', 'app.on-gpu-info-update ::: Realizing a GPU info update')

    const gpuInfo = app.getGPUFeatureStatus() // https://www.electronjs.org/docs/api/app#appgetgpufeaturestatus
    writeLog('info', 'app.on-gpu-info-update ::: Status: ', gpuInfo)
    // console.error(gpuInfo)
})

// Emitted when failed to verify the certificate for url, to trust the certificate you should prevent the default behavior
// with event.preventDefault() and call callback(true).
app.on('certificate-error', function () {
    writeLog('warn', 'app failed to verify the cert (event: certificate-error)')
})

process.on('uncaughtException', (err, origin) => {
    fs.writeSync(
        process.stderr.fd,
        `Caught exception: ${err}\n` +
        `Exception origin: ${origin}`
    )

    writeLog('error', 'UncaughtException - got error: _' + err + '_ with origin: _' + origin + '_.')
})
