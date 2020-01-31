/**
* @file xing_inject.js
* @fileOverview This module contains the inject code for the service xing
* @author yafp
* @namespace services
*/

const { ipcRenderer } = require('electron')

/**
* @function serviceXingGetUnreadMessageCount
* @summary Gets the amount of unread messages of the service Xing
* @description Gets the amount of unread messages of the service Xing
* @memberof services
*/
function serviceXingGetUnreadMessageCount () {
    console.log('serviceXingGetUnreadMessageCount ::: Checking unread message count')

    let count = null

    // let notificationElement = document.querySelector(\'[data-update="unread_conversations"]\');
    const notificationElement = document.querySelector("[data-update='unread_conversations']")

    // if (notificationElement && notificationElement.style.display !== \'none\');
    if (notificationElement && notificationElement.style.display !== 'none') {
        count = parseInt(notificationElement.textContent.trim(), 10)
    }
    console.log('serviceXingGetUnreadMessageCount ::: Total Xing chats with unread messages: ' + count)

    ipcRenderer.sendToHost(count.toString())
    return count.toString()
}

ipcRenderer.on('request', function () {
    ipcRenderer.sendToHost(serviceXingGetUnreadMessageCount())
})
