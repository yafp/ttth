const {ipcRenderer} = require("electron");


/**
* @name serviceSlackGetUnreadMessageCount
* @summary Gets the amount of unread messages of the service Slack
* @description Gets the amount of unread messages of the service Slack
*/
function serviceSlackGetUnreadMessageCount()
{
    console.log("serviceSlackGetUnreadMessageCount ::: Checking unread message count");

    var n;
    var count;
    var badge;

    var a=document.querySelectorAll(".p-channel_sidebar__channel--unread:not(.p-channel_sidebar__channel--muted)").length;
    n=0;
    var b=document.getElementsByClassName("p-channel_sidebar__badge");
    for(badge of b)
    {
        n+=isNaN(parseInt(badge.innerHTML))?0:parseInt(badge.innerHTML);
    }
    count=0<n?n:0<a?"\u2022":0,

    console.log("serviceSlackGetUnreadMessageCount ::: Total Slack chats with unread messages: " + count);

    // send back from webview to main
    ipcRenderer.sendToHost(count.toString());
    return count;
}


ipcRenderer.on("request", function()
{
    ipcRenderer.sendToHost(serviceSlackGetUnreadMessageCount());
});
