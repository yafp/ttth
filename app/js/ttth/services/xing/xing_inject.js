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

    /*
    let count = 0
    const notificationElement = document.querySelector('[data-update="unread_conversations"]')
    notificationElement && "none" !== notificationElement.style.display && (count = parseInt(notificationElement.textContent.trim(), 10)), ipcRenderer.sendToHost(count.toString())

    console.log('serviceXingGetUnreadMessageCount ::: Total Xing chats with unread messages: ' + count)
    */

    window.$ = window.jQuery = require('jquery')

    let count = 0
    count = $('span.IconWithBadge-IconWithBadge-notificationS-bdb20f8f').first().text()
    console.log('serviceXingGetUnreadMessageCount ::: Total Xing chats with unread messages: ' + count)
    ipcRenderer.sendToHost(count.toString())

    return count.toString()

    /*
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
    */
}

ipcRenderer.on('request', function () {
    ipcRenderer.sendToHost(serviceXingGetUnreadMessageCount())
})
