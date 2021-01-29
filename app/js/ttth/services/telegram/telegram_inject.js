/**
* @file telegram_inject.js
* @fileOverview This module contains the inject code for the service telegram
* @author yafp
* @namespace services
*/

const { ipcRenderer } = require('electron')

/**
* @function serviceTelegramGetUnreadMessageCount
* @summary Gets the amount of unread messages of the service Telegram
* @description Gets the amount of unread messages of the service Telegram
* @memberof services
*/
function serviceTelegramGetUnreadMessageCount () {
    console.log('serviceTelegramGetUnreadMessageCount ::: Checking unread message count')

    let count = 0
    const intervalID = window.setInterval(myCallback, 50)
    function myCallback () {
        const eventToClick = document.getElementsByClassName('im_dialog_badge badge')
        if (eventToClick.length > 0) {
            // console.log(eventToClick);
            for (let i = 0; i < eventToClick.length; i++) {
                // console.log(eventToClick[i]);

                // Check if we count this element or not
                if (!eventToClick[i].classList.contains('ng-hide')) {
                    // Count it
                    count = count + 1
                    console.log('serviceTelegramGetUnreadMessageCount ::: Found communication with unread messages. Current sum is: _' + count + '_.')
                }
            }
            clearInterval(intervalID)
        }

        console.log('serviceTelegramGetUnreadMessageCount ::: Total Telegram chats with unread messages: _' + count + '_.')

        // send back from webview to main
        ipcRenderer.sendToHost(count.toString())
        return count.toString()
    }
}

ipcRenderer.on('request', function () {
    ipcRenderer.sendToHost(serviceTelegramGetUnreadMessageCount())
})
