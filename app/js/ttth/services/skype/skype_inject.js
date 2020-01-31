/**
* @file skype_inject.js
* @fileOverview This module contains the inject code for the service skype
* @author yafp
* @namespace services
*/

const { ipcRenderer } = require('electron')

/**
* @function serviceSkypeGetUnreadMessageCount
* @summary Gets the amount of unread messages of the service Skype
* @description Gets the amount of unread messages of the service Skype
* @memberof services
*/
function serviceSkypeGetUnreadMessageCount () {
    console.log('serviceSkypeGetUnreadMessageCount ::: Checking unread message count')

    let count = 0
    const container = document.querySelector('[role="tablist"] > [title="Chats"] > div')
    if (container) {
        const children = container.children

        if (children.length === 3) {
            const elementContainer = children[children.length - 1]
            if (elementContainer) {
                const element = elementContainer.querySelector('[data-text-as-pseudo-element]')
                count = parseInt(element.dataset.textAsPseudoElement, 10)
            }
        }
    }

    console.log('serviceSkypeGetUnreadMessageCount ::: Total Skype chats with unread messages: ' + count)

    // send back from webview to main
    ipcRenderer.sendToHost(count.toString())
    return count.toString()
}

ipcRenderer.on('request', function () {
    ipcRenderer.sendToHost(serviceSkypeGetUnreadMessageCount())
})
