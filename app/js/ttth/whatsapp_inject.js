// source
// https://ourcodeworld.com/articles/read/201/how-to-send-retrieve-information-and-manipulate-the-dom-from-a-webview-with-electron-framework


// Get the ipcRenderer of electron
const {ipcRenderer} = require("electron");



function getUnreadWhatsAppMessageCount()
{
    console.log("getUnreadWhatsAppMessageCount ::: Start");

    // try to count unread messages
    const elements = document.querySelectorAll(".CxUIE, .unread");

    let count = 0;

    for (let i = 0; i < elements.length; i++)
    {
        if (elements[i].querySelectorAll('*[data-icon="muted"]').length === 0) // ignore muted
        {
            count += 1;
            console.log("checkUnread ::: Found unread message");
        }
    }
    console.log("getUnreadWhatsAppMessageCount ::: Unread messages in WhatsApp: " + count);

    ipcRenderer.sendToHost(count);

    console.log("getUnreadWhatsAppMessageCount ::: End");
}



// Do something according to a request of your mainview
//
ipcRenderer.on("request", function()
{
    ipcRenderer.sendToHost(getUnreadWhatsAppMessageCount());
});
