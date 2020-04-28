/**
* @file twitter_inject.js
* @fileOverview This module contains the inject code for the service twitter
* @author yafp
* @namespace services
*/

const { ipcRenderer } = require('electron')

/**
* @function serviceTwitterGetUnreadMessageCount
* @summary Gets the amount of unread DMs of the service Twitter
* @description Gets the amount of unread DMs of the service Twitter
* @memberof services
*/
function serviceTwitterGetUnreadMessageCount () {
    console.log('serviceTwitterGetUnreadMessageCount ::: Checking unread message count')

    let count = 0
    const elem = document.querySelector('a[href="/messages"] div div')

    if (elem) {
        count = parseInt(elem.innerText, 10)
    }

    console.log('serviceTwitterGetUnreadMessageCount ::: Total unread Twitter DMs: ' + count)

    if (Number.isNaN(count)) {
        count = 0
        console.warn('serviceTwitterGetUnreadMessageCount ::: Total unread Twitter DMs was NaN - is now set to: ' + count)
    }

    ipcRenderer.sendToHost(count.toString())
    return count.toString()
}

ipcRenderer.on('request', function () {
    ipcRenderer.sendToHost(serviceTwitterGetUnreadMessageCount())
})
