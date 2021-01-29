/**
* @file threema_inject.js
* @fileOverview This module contains the inject code for the service threema
* @author yafp
* @namespace services
*/

const { ipcRenderer } = require('electron')

/**
* @function serviceThreemaGetUnreadMessageCount
* @summary Gets the amount of unread messages of the service Threema
* @description Gets the amount of unread messages of the service Threema
* @memberof services
*/
function serviceThreemaGetUnreadMessageCount () {
    console.log('serviceThreemaGetUnreadMessageCount ::: Checking unread message count')

    let unreadCount = 0

    let newUnread = 0
    try {
        // let webClientService = angular.element(document.documentElement).injector().get(\'WebClientService\');
        const webClientService = angular.element(document.documentElement).injector().get('WebClientService')
        const conversations = webClientService.conversations.conversations
        conversations.forEach(function (conversation) {
            newUnread += conversation.unreadCount
        })
    } catch (e) {
        console.log('serviceThreemaGetUnreadMessageCount ::: Catch')
    }

    if (newUnread !== unreadCount) {
        unreadCount = newUnread

        // send back from webview to main
        ipcRenderer.sendToHost(unreadCount.toString())
        return unreadCount.toString()
    }

    console.log('serviceThreemaGetUnreadMessageCount ::: Total Threema chats with unread messages: ' + unreadCount)
}

ipcRenderer.on('request', function () {
    ipcRenderer.sendToHost(serviceThreemaGetUnreadMessageCount())
})
