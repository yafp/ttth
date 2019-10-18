const {ipcRenderer} = require("electron");


/**
* @name serviceMicrosoftTeamsGetUnreadMessageCount
* @summary Gets the amount of unread messages of the service Teams
* @description Gets the amount of unread messages of the service Teams
*/
function serviceMicrosoftTeamsGetUnreadMessageCount()
{
    console.log("serviceMicrosoftTeamsGetUnreadMessageCount ::: Checking unread message count");

    // via: https://github.com/meetfranz/Microsoft-Teams/blob/master/webview.js
    let messages = 0;
    const badge = document.querySelector('.activity-badge.dot-activity-badge .activity-badge');
    if (badge) 
    {
        const value = parseInt(badge.innerHTML, 10);

        if (!isNaN(value)) 
        {
            messages = value;
        }
    }

    console.log("serviceMicrosoftTeamsGetUnreadMessageCount ::: Total Outlook unread messages: " + messages);

    ipcRenderer.sendToHost(messages);
}


ipcRenderer.on("request", function()
{
    ipcRenderer.sendToHost(serviceMicrosoftTeamsGetUnreadMessageCount());
});

