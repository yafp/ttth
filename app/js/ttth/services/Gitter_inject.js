const {ipcRenderer} = require("electron");


/**
* @name serviceGitterGetUnreadMessageCount
* @summary Gets the amount of unread messages of the service Gitter
* @description Gets the amount of unread messages of the service Gitter
*/
function serviceGitterGetUnreadMessageCount()
{
    console.log("serviceGitterGetUnreadMessageCount ::: Checking unread message count");

    var t;
    var i;
    var e=document.getElementsByClassName("room-item__unread-indicator"),t=0;
    for(i=0;i<e.length;i++)
    {
        t+=isNaN(parseInt(e[i].innerHTML.trim())) ? 0 : parseInt(e[i].innerHTML.trim());
    }

    console.log("serviceGitterGetUnreadMessageCount ::: Total GoogleMail unread messages: " + t);

    // send back from webview to main
    ipcRenderer.sendToHost(t);
}


ipcRenderer.on("request", function()
{
    ipcRenderer.sendToHost(serviceGitterGetUnreadMessageCount());
});
