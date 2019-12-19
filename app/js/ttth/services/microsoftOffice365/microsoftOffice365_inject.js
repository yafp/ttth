const { ipcRenderer } = require('electron')

/**
* @name serviceMicrosoftOffice365GetUnreadMessageCount
* @summary Gets the amount of unread messages of the service Outlook
* @description Gets the amount of unread messages of the service Outlook
*/
function serviceMicrosoftOffice365GetUnreadMessageCount () {
    console.log('serviceMicrosoftOffice365GetUnreadMessageCount ::: Checking unread message count')

    var count = $('.subfolders [role=treeitem]:first .treeNodeRowElement').siblings().last().text()

    console.log('serviceMicrosoftOffice365GetUnreadMessageCount ::: Total Office 365 unread messages: ' + count)

    ipcRenderer.sendToHost(count.toString())
    return count.toString()
}

ipcRenderer.on('request', function () {
    ipcRenderer.sendToHost(serviceMicrosoftOffice365GetUnreadMessageCount())
})
