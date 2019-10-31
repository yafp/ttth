const {ipcRenderer} = require("electron");


/**
* @name serviceSteamChatGetUnreadMessageCount
* @summary Gets the amount of unread messages of the service ICQ
* @description Gets the amount of unread messages of the service ICQ
*/
function serviceSteamChatGetUnreadMessageCount()
{
    console.log("serviceSteamChatGetUnreadMessageCount ::: Checking unread message count");

    var i;
    var e=document.getElementsByClassName("unread_message_count_value"),t=0;
    for(i=0; i<e.length; i++)
    {
        t+=isNaN(parseInt(e[i].innerHTML.trim())) || e[i].parentNode.style.display === "none" ? 0 : parseInt(e[i].innerHTML.trim());
    }

    console.log("serviceSteamChatGetUnreadMessageCount ::: Total Steam unread messages: " + e);

    ipcRenderer.sendToHost(e.toString());
    return e;
}


ipcRenderer.on("request", function()
{
    ipcRenderer.sendToHost(serviceSteamChatGetUnreadMessageCount());
});
