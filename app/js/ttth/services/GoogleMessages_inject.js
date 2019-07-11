const {ipcRenderer} = require("electron");


/**
* @name serviceGoogleMessagesGetUnreadMessageCount
* @summary Gets the amount of unread messages of the service googleMessages
* @description Gets the amount of unread messages of the service googleMessages
*/
function serviceGoogleMessagesGetUnreadMessageCount()
{
    console.log("serviceGoogleMessagesGetUnreadMessageCount ::: Start");

    var counter = document.querySelectorAll(".tpEAA.yrs5ff").length;
    
    console.log("serviceGoogleMessagesGetUnreadMessageCount ::: Total GoogleMessages unread messages: " + counter);

    // send back from webview to main
    ipcRenderer.sendToHost(counter);
}


ipcRenderer.on("request", function()
{
    ipcRenderer.sendToHost(serviceGoogleMessagesGetUnreadMessageCount());
});
