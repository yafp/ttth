/**
* @file utils.js
* @fileOverview This module contains all utility functions
* @author yafp
* @module utils
*/

'use strict'

/**
* @function writeConsoleMsg
* @summary Writes console output for the renderer process
* @description Writes console output for the renderer process
* @param {string} type - String which defines the log type
* @param {string} message - String which defines the log message
* @param {string} optionalObject - An optional object which might contain additional informations
*/
function writeConsoleMsg (type, message, optionalObject = '') {
    const logR = require('electron-log')
    const prefix = '[ Renderer ] '

    // electron-log can: error, warn, info, verbose, debug, silly
    switch (type) {
    case 'info':
        logR.info(prefix + message, optionalObject)
        break

    case 'warn':
        logR.warn(prefix + message, optionalObject)
        break

    case 'error':
        logR.error(prefix + message, optionalObject)
        break

    default:
        logR.silly(prefix + message, optionalObject)
        break
    }
}

/**
* @function  showNoty
* @summary Shows a noty notification
* @description Creates an in-app notification using the noty framework
* @param {string} type - Options: alert, success, warning, error, info/information
* @param {string} message - notification text
* @param {number} timeout - Timevalue, defines how long the message should be displayed. Use 0 for no-timeout
*/
function showNoty (type, message, timeout = 3000) {
    const Noty = require('noty')
    new Noty({
        type: type,
        timeout: timeout,
        theme: 'bootstrap-v4',
        layout: 'bottom',
        text: message,
        animation: {
            open: 'animated fadeIn', // Animate.css class names: default: bounceInRight
            close: 'animated fadeOut' // Animate.css class names: default:bounceOutRight
        }
    }).show()
}

/**
* @function  isMac
* @summary Checks if the operating system type is mac/darwin or not
* @description Checks if the operating system type is mac/darwin or not
* @return value - Boolean: True if mac, false if not
*/
function isMac () {
    const os = require('os')

    // os types:
    //
    // - Darwin
    // - Linux
    // - Windows_NT
    writeConsoleMsg('info', 'isMac ::: Detected operating system type is: ' + os.type())
    if (os.type() === 'Darwin') {
        writeConsoleMsg('info', 'isMac ::: true')
        return true
    } else {
        writeConsoleMsg('info', 'isMac ::: false')
        return false
    }
}

/**
* @function  isLinux
* @summary Checks if the operating system type is linux or not
* @description Checks if the operating system type islinux or not
* @return value - Boolean: True if linux, false if not
*/
function isLinux () {
    const os = require('os')

    // os types:
    //
    // - Darwin
    // - Linux
    // - Windows_NT
    writeConsoleMsg('info', 'isLinux ::: Detected operating system type is: ' + os.type())
    if (os.type() === 'Linux') {
        writeConsoleMsg('info', 'isLinux ::: true')
        return true
    } else {
        writeConsoleMsg('info', 'isLinux ::: false')
        return false
    }
}

/**
* @function  isWindows
* @summary Checks if the operating system type is windows or not
* @description Checks if the operating system type is windows or not
* @return value - Boolean: True if windows, false if not
*/
function isWindows () {
    const os = require('os')

    // os types:
    //
    // - Darwin
    // - Linux
    // - Windows_NT
    writeConsoleMsg('info', 'isWindows ::: Detected operating system type is: ' + os.type())
    if (os.type() === 'Windows NT') {
        writeConsoleMsg('info', 'isWindows ::: true')
        return true
    } else {
        writeConsoleMsg('info', 'isWindows ::: false')
        return false
    }
}

/**
* @function  openURL
* @summary Opens an url in browser
* @description Opens a given url in default browser. This is pretty slow, but got no better solution so far.
* @param url - URL string which contains the target url
*/
function openURL (url) {
    const { shell } = require('electron')
    shell.openExternal(url)
}

/**
* @function  getHostName
* @summary Parsing the Hostname From a Url
* @description Parsing the Hostname From a Url
* @param url
*/
function getHostName (url) {
    const match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i)
    if (match !== null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
        return match[2]
    } else {
        return null
    }
}

/**
* @function  getDomain
* @summary Parsing the Domain From a Url
* @description Parsing the Domain From a Url
* @param url
* @return domain
*/
function getDomain (url) {
    const hostName = getHostName(url)
    let domain = hostName

    if (hostName !== null) {
        const parts = hostName.split('.').reverse()

        if (parts !== null && parts.length > 1) {
            domain = parts[1] + '.' + parts[0]

            if (hostName.toLowerCase().indexOf('.co.uk') !== -1 && parts.length > 2) {
                domain = parts[2] + '.' + domain
            }
        }
    }
    return domain
}

/**
* @function globalObjectGet
* @summary Gets a value of a single property from the global object in main.js
* @description Gets a value of a single property from the global object in main.js
* @param {String} property - Name of the property
* @return {string} value - Value of the property
*/
function globalObjectGet (property) {
    const { remote } = require('electron')
    const value = remote.getGlobal('sharedObj')[property]
    writeConsoleMsg('info', 'globalObjectGet ::: Property: _' + property + '_ has the value: _' + value + '_.')
    return value
}

/**
* @function globalObjectSet
* @summary Updates the value of a single property from the global object in main.js
* @description Updates the value of a single property from the global object in main.js
* @param {String} property - Name of the property
* @param {String} value - The new value of the property
*/
function globalObjectSet (property, value) {
    const { ipcRenderer } = require('electron')
    ipcRenderer.send('globalObjectSet', property, value)
}

/**
* @function getAppVersion
* @summary Gets the version string of the current build
* @description Gets the version string of the current build
* @preturn {String} versionString - The version number
*/
function getAppVersion () {
    const versionString = require('electron').remote.app.getVersion()
    writeConsoleMsg('info', 'getAppVersion ::: Appversion is: _' + versionString + '_.')
    return versionString
}

/**
* @function jsonStoragePathSet
* @summary Sets the path for json-storage
* @description Sets the path for json-storage
* @param Stringg} path - The path for json-storage
*/
function jsonStoragePathSet (path = false) {
    const storage = require('electron-json-storage')
    const remote = require('electron').remote
    const app = remote.app
    const pathX = require('path') // must have other name, as path is already declared ...

    let newPath

    if (path === false) {
        newPath = pathX.join(app.getPath('userData'), 'storage')
        writeConsoleMsg('info', 'jsonStoragePathSet ::: Set jsonStorage path to default: _' + newPath + '_.')
    } else {
        newPath = pathX.join(app.getPath('userData'), 'ttthUserSettings') // set path for user-settings
        writeConsoleMsg('info', 'jsonStoragePathSet ::: Set jsonStorage path to ttthUserSettings: _' + newPath + '_.')
    }

    storage.setDataPath(newPath)
}

/**
* @function generateNewRandomServiceID
* @summary Generates a config-file name while adding a new service
* @description Gets the serviceType and adds a random string. The outcome is the name for the new service config-file.
* @param {string}  serviceType - The type of the service
* @return {string}  newServiceId - serviceType + Random string
*/
function generateNewRandomServiceID (serviceType) {
    let i = 0
    const length = 24
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let randomString = ''
    let newServiceId = ''

    // create random string
    for (i = 0; i < length; i++) {
        randomString += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    newServiceId = serviceType + '_' + randomString
    writeConsoleMsg('info', 'generateNewRandomServiceID ::: Generated a new service ID: _' + newServiceId + '_.')
    return newServiceId
}

// ----------------------------------------------------------------------------
// Exporting all functions
// ----------------------------------------------------------------------------
//
module.exports.writeConsoleMsg = writeConsoleMsg
module.exports.showNoty = showNoty
module.exports.isMac = isMac
module.exports.isLinux = isLinux
module.exports.isWindows = isWindows
module.exports.openURL = openURL
module.exports.getHostName = getHostName
module.exports.getDomain = getDomain
module.exports.globalObjectGet = globalObjectGet
module.exports.globalObjectSet = globalObjectSet
module.exports.getAppVersion = getAppVersion
module.exports.jsonStoragePathSet = jsonStoragePathSet
module.exports.generateNewRandomServiceID = generateNewRandomServiceID
