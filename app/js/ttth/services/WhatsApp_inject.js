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
    //
    //const elements = document.querySelectorAll(".CxUIE, .unread"); // First version
    //const elements = document.querySelectorAll(".P6z4j, .unread"); // Rambox - currently using
    //const elements = document.querySelectorAll('.CxUIE, .unread, ._0LqQ'); // Franz
    const elements = document.querySelectorAll("#pane-side .P6z4j, .unread");
    console.log(elements);

    let count = 0;
    for (let i = 0; i < elements.length; i++)
    {
        //if (elements[i].querySelectorAll('*[data-icon="muted"]').length === 0) // ignore muted
        if (elements[i].parentNode.parentNode.querySelectorAll("#pane-side *[data-icon='muted']").length === 0) 
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

    // Report back the unread count
    ipcRenderer.sendToHost(count);

    console.log("serviceWhatsAppGetUnreadMessageCount ::: End");
}



ipcRenderer.on("request", function()
{
    ipcRenderer.sendToHost(serviceWhatsAppGetUnreadMessageCount());
});
