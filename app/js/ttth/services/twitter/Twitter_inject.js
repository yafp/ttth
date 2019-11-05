const {ipcRenderer} = require("electron");


/**
* @name serviceTwitterGetUnreadMessageCount
* @summary Gets the amount of unread DMs of the service Twitter
* @description Gets the amount of unread DMs of the service Twitter
*/
function serviceTwitterGetUnreadMessageCount()
{
    console.log("serviceTwitterGetUnreadMessageCount ::: Checking unread message count");

    let count = 0;
    const elem = document.querySelector('a[href="/messages"] div div');

    if (elem)
    {
        count = parseInt(elem.innerText, 10);
    }

    console.log("serviceTwitterGetUnreadMessageCount ::: Total unread Twitter DMs: " + count);

    ipcRenderer.sendToHost(count.toString());
    return count.toString();
}


ipcRenderer.on("request", function()
{
    ipcRenderer.sendToHost(serviceTwitterGetUnreadMessageCount());
});
