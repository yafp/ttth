const { ipcRenderer } = require('electron')

/**
* @name serviceMicrosoftOutlookGetUnreadMessageCount
* @summary Gets the amount of unread messages of the service Outlook
* @description Gets the amount of unread messages of the service Outlook
*/
function serviceMicrosoftOutlookGetUnreadMessageCount () {
    console.log('serviceMicrosoftOutlookGetUnreadMessageCount ::: Checking unread message count')

    var e = document.querySelector('.ms-FocusZone i[data-icon-name=Inbox]').parentNode.querySelector('span span') !== null ? parseInt(document.querySelector('.ms-FocusZone i[data-icon-name=Inbox]').parentNode.querySelector('span span').innerText) : 0

    console.log('serviceMicrosoftOutlookGetUnreadMessageCount ::: Total Outlook unread messages: ' + e)

    ipcRenderer.sendToHost(e.toString())
    return e.toString()
}

ipcRenderer.on('request', function () {
    ipcRenderer.sendToHost(serviceMicrosoftOutlookGetUnreadMessageCount())
})
