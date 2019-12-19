const { ipcRenderer } = require('electron')

/**
* @name serviceICQGetUnreadMessageCount
* @summary Gets the amount of unread messages of the service ICQ
* @description Gets the amount of unread messages of the service ICQ
*/
function serviceICQGetUnreadMessageCount () {
    console.log('serviceICQGetUnreadMessageCount ::: Checking unread message count')

    let count = 0
    for (const counter of document.getElementsByClassName('icq-msg-counter')) {
        count += parseInt(counter.style.display === 'block' ? counter.innerHTML.trim() : 0)
    }

    console.log('serviceICQGetUnreadMessageCount ::: Total ICQ unread messages: ' + count)

    ipcRenderer.sendToHost(count.toString())
    return count.toString()
}

ipcRenderer.on('request', function () {
    ipcRenderer.sendToHost(serviceICQGetUnreadMessageCount())
})
