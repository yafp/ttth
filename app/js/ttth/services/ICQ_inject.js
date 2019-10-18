const {ipcRenderer} = require("electron");


/**
* @name serviceICQGetUnreadMessageCount
* @summary Gets the amount of unread messages of the service ICQ
* @description Gets the amount of unread messages of the service ICQ
*/
function serviceICQGetUnreadMessageCount()
{
    console.log("serviceICQGetUnreadMessageCount ::: Checking unread message count");

    let total=0;
    for(let counter of document.getElementsByClassName("icq-msg-counter"))total+=parseInt("block"===counter.style.display?counter.innerHTML.trim():0);

    console.log("serviceICQGetUnreadMessageCount ::: Total ICQ unread messages: " + total);

    ipcRenderer.sendToHost(total);
}


ipcRenderer.on("request", function()
{
    ipcRenderer.sendToHost(serviceICQGetUnreadMessageCount());
});
