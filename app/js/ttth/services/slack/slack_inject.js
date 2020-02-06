/**
* @file slack_inject.js
* @fileOverview This module contains the inject code for the service slack
* @author yafp
* @namespace services
*/

const { ipcRenderer } = require('electron')

/**
* @function serviceSlackGetUnreadMessageCount
* @summary Gets the amount of unread messages of the service Slack
* @description Gets the amount of unread messages of the service Slack
* @memberof services
*/
function serviceSlackGetUnreadMessageCount () {
    console.log('serviceSlackGetUnreadMessageCount ::: Checking unread message count')

    // via hamsket: https://github.com/TheGoddessInari/hamsket/commit/d1e29e5a27fc3b18768384a1dfae673a0d7d05df
    //
    const indirectSelector = '.p-channel_sidebar__channel--unread:not(.p-channel_sidebar__channel--muted)'
    // const indirect = document.querySelectorAll(indirectSelector).length
    let direct = 0
    const badges = document.querySelectorAll(indirectSelector + ' > .p-channel_sidebar__badge')
    for (const badge of badges) {
        const i = parseInt(badge.innerHTML)
        direct += isNaN(i) ? 0 : i
    }

    console.log('serviceSlackGetUnreadMessageCount ::: Total Slack chats with unread messages: ' + direct)

    // send back from webview to main
    ipcRenderer.sendToHost(direct.toString())
    return direct.toString()
}

ipcRenderer.on('request', function () {
    ipcRenderer.sendToHost(serviceSlackGetUnreadMessageCount())
})
