const {ipcRenderer} = require("electron");


/**
* @name serviceMessengerGetUnreadMessageCount
* @summary Gets the amount of unread messages of the service Messenger
* @description Gets the amount of unread messages of the service Messenger
*/
function serviceMessengerGetUnreadMessageCount()
{
    console.log("serviceMessengerGetUnreadMessageCount ::: Checking unread message count");

    let count = document.querySelectorAll("._5fx8:not(._569x),._1ht3:not(._569x)").length;
    const messageRequestsElement = document.querySelector("._5nxf");
    if (messageRequestsElement) 
    {
        count += parseInt(messageRequestsElement.innerHTML, 10);
    }

    console.log("serviceMessengerGetUnreadMessageCount ::: Total Messenger chats with unread messages: " + count);

    // send back from webview to main
    ipcRenderer.sendToHost(count.toString());
    return count.toString();
}


ipcRenderer.on("request", function()
{
    ipcRenderer.sendToHost(serviceMessengerGetUnreadMessageCount());
});
