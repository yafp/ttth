const {ipcRenderer} = require("electron");


/**
* @name serviceMicrosoftOutlookGetUnreadMessageCount
* @summary Gets the amount of unread messages of the service Outlook
* @description Gets the amount of unread messages of the service Outlook
*/
function serviceMicrosoftOutlookGetUnreadMessageCount()
{
    /*
    console.log("serviceMicrosoftOutlookGetUnreadMessageCount ::: Checking unread message count");

    var e=null!==$(".ms-FocusZone [role=tree]:last i[data-icon-name=Inbox]").siblings()[1].querySelector("span span")?$(".ms-FocusZone [role=tree]:last i[data-icon-name=Inbox]").siblings()[1].querySelector("span span").innerText:0;

    console.log("serviceMicrosoftOutlookGetUnreadMessageCount ::: Total Outlook unread messages: " + e);

    ipcRenderer.sendToHost(e);
    */
}


ipcRenderer.on("request", function()
{
    ipcRenderer.sendToHost(serviceMicrosoftOutlookGetUnreadMessageCount());
});
