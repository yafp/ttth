/**
* @file microsoftOffice365_inject.js
* @fileOverview This module contains the inject code for the service microsoftOffice365
* @author yafp
* @namespace services
*/

const { ipcRenderer } = require('electron')

/**
* @function serviceMicrosoftOffice365GetUnreadMessageCount
* @summary Gets the amount of unread messages of the service Outlook
* @description Gets the amount of unread messages of the service Outlook
* @memberof services
*/
function serviceMicrosoftOffice365GetUnreadMessageCount () {
    console.log('serviceMicrosoftOffice365GetUnreadMessageCount ::: Checking unread message count')

    const count = $('.subfolders [role=treeitem]:first .treeNodeRowElement').siblings().last().text()

    console.log('serviceMicrosoftOffice365GetUnreadMessageCount ::: Total Office 365 unread messages: ' + count)

    ipcRenderer.sendToHost(count.toString())
    return count.toString()
}

ipcRenderer.on('request', function () {
    ipcRenderer.sendToHost(serviceMicrosoftOffice365GetUnreadMessageCount())
})
