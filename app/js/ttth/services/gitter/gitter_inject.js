/**
* @file gitter_inject.js
* @fileOverview This script contains the inject code for the service gitter
* @author yafp
* @namespace services
*/

const { ipcRenderer } = require('electron')

/**
* @function serviceGitterGetUnreadMessageCount
* @summary Gets the amount of unread messages of the service Gitter
* @description Gets the amount of unread messages of the service Gitter
* @memberof services
*/
function serviceGitterGetUnreadMessageCount () {
    console.log('serviceGitterGetUnreadMessageCount ::: Checking unread message count')

    // via hamsket: https://github.com/TheGoddessInari/hamsket/commit/c642d881660c6d5369cdb8f18e5bc3a165a87258
    const e = document.getElementsByClassName('unread-indicator')
    let c = 0
    for (const i of e)c += parseInt(i.innerHTML.trim(), 10) || 0

    console.log('serviceGitterGetUnreadMessageCount ::: Total Gitter unread messages: ' + c)

    // send back from webview to main
    ipcRenderer.sendToHost(c.toString())
    return c.toString()
}

ipcRenderer.on('request', function () {
    ipcRenderer.sendToHost(serviceGitterGetUnreadMessageCount())
})
