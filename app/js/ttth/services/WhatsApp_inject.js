// source
// https://ourcodeworld.com/articles/read/201/how-to-send-retrieve-information-and-manipulate-the-dom-from-a-webview-with-electron-framework


// Get the ipcRenderer of electron
const {ipcRenderer} = require("electron");


/**
* @name serviceWhatsAppGetUnreadMessageCount
* @summary Gets the amount of unread messages of the service WhatsApp
* @description Gets the amount of unread messages of the service WhatsApp
*/
function serviceWhatsAppGetUnreadMessageCount()
{
    console.log("serviceWhatsAppGetUnreadMessageCount ::: Start");

    // try to count unread messages
    //const elements = document.querySelectorAll(".CxUIE, .unread");
    const elements = document.querySelectorAll('.P6z4j, .unread');
    console.log(elements);

    let count = 0;
    for (let i = 0; i < elements.length; i++)
    {
        if (elements[i].querySelectorAll('*[data-icon="muted"]').length === 0) // ignore muted
        {
            count += 1;
            console.log("serviceWhatsAppGetUnreadMessageCount ::: Found unread message");
        }
        else
        {
            console.log("serviceWhatsAppGetUnreadMessageCount ::: Ignoring unread message message from muted communication");
        }
    }
    console.log("serviceWhatsAppGetUnreadMessageCount ::: Unread messages in WhatsApp: _" + count + "_.");

    ipcRenderer.sendToHost(count);

    console.log("serviceWhatsAppGetUnreadMessageCount ::: End");
}



// Do something according to a request of your mainview
//
ipcRenderer.on("request", function()
{
    ipcRenderer.sendToHost(serviceWhatsAppGetUnreadMessageCount());
});
