/**
* @file googleMessages_inject.js
* @fileOverview This module contains the inject code for the service googleMessages
* @author yafp
* @namespace services
*/

const { ipcRenderer } = require('electron')

/**
* @function serviceGoogleMessagesGetUnreadMessageCount
* @summary Gets the amount of unread messages of the service googleMessages
* @description Gets the amount of unread messages of the service googleMessages
* @memberof services
*/
function serviceGoogleMessagesGetUnreadMessageCount () {
    console.log('serviceGoogleMessagesGetUnreadMessageCount ::: Checking unread message count')

    const count = document.querySelectorAll('.tpEAA.yrs5ff').length

    console.log('serviceGoogleMessagesGetUnreadMessageCount ::: Total GoogleMessages unread messages: ' + count)

    // send back from webview to main
    ipcRenderer.sendToHost(count.toString())
    return count.toString()
}

ipcRenderer.on('request', function () {
    ipcRenderer.sendToHost(serviceGoogleMessagesGetUnreadMessageCount())
})
