/**
* @file utils.js
* @fileOverview This module contains all utility functions
* @author yafp
* @module utils
*/

'use strict'

/**
* @function  writeConsoleMsg
* @summary Writes console output for the renderer process
* @description Writes console output for the renderer process
* @param type - String which defines the log type
* @param message - String which defines the log message
*/
function writeConsoleMsg (type, message) {
    // const logR = require("electron-log"); // for logging to file

    // log to file
    // logR.transports.file.level = true;

    // log to console
    // logR.transports.console.level = false; // TODO: should depend on the verbose setting in main.js

    const prefix = '[ Renderer ]'
    const log = require('electron-log')
    // electron-log can: error, warn, info, verbose, debug, silly
    switch (type) {
    case 'info':
        // logR.error(logMessage); //  to file
        log.info(prefix + ' ' + message)
        break

    case 'warn':
        log.warn(prefix + ' ' + message)
        break

    case 'error':
        log.error(prefix + ' ' + message)
        break

    default:
        log.silly(prefix + ' ' + message)
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
        text: message
    }).show()
}

/**
* @function  isMac
* @summary Checks if the operating system type is mac/darwin or not
* @description Checks if the operating system type is mac/darwin or not
* @return value - Boolean: True if mac, false if not
*/
function isMac () {
    var os = require('os')

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
    var os = require('os')

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
    var os = require('os')

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
    var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i)
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
    var hostName = getHostName(url)
    var domain = hostName

    if (hostName !== null) {
        var parts = hostName.split('.').reverse()

        if (parts !== null && parts.length > 1) {
            domain = parts[1] + '.' + parts[0]

            if (hostName.toLowerCase().indexOf('.co.uk') !== -1 && parts.length > 2) {
                domain = parts[2] + '.' + domain
            }
        }
    }
    return domain
}

// Exporting all functions
//
module.exports.writeConsoleMsg = writeConsoleMsg
module.exports.showNoty = showNoty
module.exports.isMac = isMac
module.exports.isLinux = isLinux
module.exports.isWindows = isWindows
module.exports.openURL = openURL
module.exports.getHostName = getHostName
module.exports.getDomain = getDomain
