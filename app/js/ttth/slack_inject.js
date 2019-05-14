// Get the ipcRenderer of electron
const {ipcRenderer} = require("electron");


// Do something according to a request of your mainview
//
ipcRenderer.on("request", function()
{
    console.log("request ::: Start");
    ipcRenderer.sendToHost(getUnreadSlackMessageCount());
    console.log("request ::: End");
});


/*
ipcRenderer.on("alert-something",function(event,data)
{
    alert(data);
});
*/


/*
ipcRenderer.on("change-text-element",function(event,data)
{
    // the document references to the document of the <webview>
    document.getElementById(data.id).innerHTML = data.text;
});
*/



function getUnreadSlackMessageCount()
{
    console.log("getUnreadSlackMessageCount ::: Start");

    var a=document.querySelectorAll(".p-channel_sidebar__channel--unread:not(.p-channel_sidebar__channel--muted)").length;
    n=0;
    var b=document.getElementsByClassName("p-channel_sidebar__badge");
    for(badge of b)n+=isNaN(parseInt(badge.innerHTML))?0:parseInt(badge.innerHTML);
    counter=0<n?n:0<a?"\u2022":0,

    console.log("getUnreadSlackMessageCount ::: Total Slack chats with unread messages: " + counter);

    // send back from webview to main
    ipcRenderer.sendToHost(counter);

    return counter;
}
