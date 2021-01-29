/**
* @file steam_inject.js
* @fileOverview This module contains the inject code for the service steam
* @author yafp
* @namespace services
*/

const { ipcRenderer } = require('electron')

/**
* @function serviceSteamChatGetUnreadMessageCount
* @summary Gets the amount of unread messages of the service steam
* @description Gets the amount of unread messages of the service steam
* @memberof services
*/
function serviceSteamChatGetUnreadMessageCount () {
    console.log('serviceSteamChatGetUnreadMessageCount ::: Checking unread message count')

    let i
    const e = document.getElementsByClassName('unread_message_count_value')
    let t = 0
    for (i = 0; i < e.length; i++) {
        t += isNaN(parseInt(e[i].innerHTML.trim())) || e[i].parentNode.style.display === 'none' ? 0 : parseInt(e[i].innerHTML.trim())
    }

    console.log('serviceSteamChatGetUnreadMessageCount ::: Total Steam unread messages: ' + e)

    ipcRenderer.sendToHost(e.toString())
    return e.toString()
}

ipcRenderer.on('request', function () {
    ipcRenderer.sendToHost(serviceSteamChatGetUnreadMessageCount())
})
