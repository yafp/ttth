/**
* @file googleMail_inject.js
* @fileOverview This module contains the inject code for the service googleMail
* @author yafp
* @namespace services
*/

const { ipcRenderer } = require('electron')

/**
* @function serviceGoogleMailGetUnreadMessageCount
* @summary Gets the amount of unread messages of the service GoogleMail
* @description Gets the amount of unread messages of the service GoogleMail
* @memberof services
*/
function serviceGoogleMailGetUnreadMessageCount () {
    console.log('serviceGoogleMailGetUnreadMessageCount ::: Checking unread message count')

    const count = document.querySelector('.aim .aio').querySelector('span').querySelector('a').getAttribute('aria-label').replace(/\D/g, '')

    console.log('serviceGoogleMailGetUnreadMessageCount ::: Total GoogleMail unread messages: ' + count)

    // send back from webview to main
    ipcRenderer.sendToHost(count.toString())
    return count.toString()
}

ipcRenderer.on('request', function () {
    ipcRenderer.sendToHost(serviceGoogleMailGetUnreadMessageCount())
})
