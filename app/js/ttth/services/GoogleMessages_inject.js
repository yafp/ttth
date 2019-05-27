// Get the ipcRenderer of electron
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
    if(t>=1)
    {
        //rambox.setUnreadCount(t)
    }

    console.log("serviceGoogleMessagesGetUnreadMessageCount ::: Total GoogleMessages unread messages: " + counter);

    // send back from webview to main
    ipcRenderer.sendToHost(counter);
}



// Do something according to a request of your mainview
ipcRenderer.on("request", function()
{
    ipcRenderer.sendToHost(serviceGoogleMessagesGetUnreadMessageCount());
});
