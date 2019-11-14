const {ipcRenderer} = require("electron");


/**
* @name serviceGoogleMessagesGetUnreadMessageCount
* @summary Gets the amount of unread messages of the service googleMessages
* @description Gets the amount of unread messages of the service googleMessages
*/
function serviceGoogleMessagesGetUnreadMessageCount()
{
    console.log("serviceGoogleMessagesGetUnreadMessageCount ::: Checking unread message count");

    var count = document.querySelectorAll(".tpEAA.yrs5ff").length;
    
    console.log("serviceGoogleMessagesGetUnreadMessageCount ::: Total GoogleMessages unread messages: " + count);

    // send back from webview to main
    ipcRenderer.sendToHost(count.toString());
    return count.toString();
}


ipcRenderer.on("request", function()
{
    ipcRenderer.sendToHost(serviceGoogleMessagesGetUnreadMessageCount());
});
