// Get the ipcRenderer of electron
const {ipcRenderer} = require("electron");


/**
* @name serviceXingGetUnreadMessageCount
* @summary Gets the amount of unread messages of the service Xing
* @description Gets the amount of unread messages of the service Xing
*/
function serviceXingGetUnreadMessageCount()
{
    console.log("serviceXingGetUnreadMessageCount ::: Start");

    let count = null;

    //let notificationElement = document.querySelector(\'[data-update="unread_conversations"]\');
    let notificationElement = document.querySelector("[data-update='unread_conversations']");

    //if (notificationElement && notificationElement.style.display !== \'none\');
    if (notificationElement && notificationElement.style.display !== "none")
    {
        count = parseInt(notificationElement.textContent.trim(), 10);
    }
    console.log("serviceXingGetUnreadMessageCount ::: Total Xing chats with unread messages: " + count);

    ipcRenderer.sendToHost(count);

    console.log("serviceXingGetUnreadMessageCount ::: End");
}


// Do something according to a request of your mainview
ipcRenderer.on("request", function()
{
    ipcRenderer.sendToHost(serviceXingGetUnreadMessageCount());
});
