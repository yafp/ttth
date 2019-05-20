// Get the ipcRenderer of electron
const {ipcRenderer} = require("electron");

function serviceSlackGetUnreadMessageCount()
{
    console.log("serviceSlackGetUnreadMessageCount ::: Start");

    var n;
    var counter;

    var a=document.querySelectorAll(".p-channel_sidebar__channel--unread:not(.p-channel_sidebar__channel--muted)").length;
    n=0;
    var b=document.getElementsByClassName("p-channel_sidebar__badge");
    for(badge of b)n+=isNaN(parseInt(badge.innerHTML))?0:parseInt(badge.innerHTML);
    counter=0<n?n:0<a?"\u2022":0,

    console.log("serviceSlackGetUnreadMessageCount ::: Total Slack chats with unread messages: " + counter);

    // send back from webview to main
    ipcRenderer.sendToHost(counter);

    console.log("serviceSlackGetUnreadMessageCount ::: End");
}


// Do something according to a request of your mainview
ipcRenderer.on("request", function()
{
    ipcRenderer.sendToHost(serviceSlackGetUnreadMessageCount());
});
