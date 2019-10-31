const {ipcRenderer} = require("electron");


/**
* @name serviceThreemaGetUnreadMessageCount
* @summary Gets the amount of unread messages of the service Threema
* @description Gets the amount of unread messages of the service Threema
*/
function serviceThreemaGetUnreadMessageCount()
{
    console.log("serviceThreemaGetUnreadMessageCount ::: Checking unread message count");

    var unreadCount;

    let newUnread = 0;
    try
    {
        //let webClientService = angular.element(document.documentElement).injector().get(\'WebClientService\');
        let webClientService = angular.element(document.documentElement).injector().get("WebClientService");
        let conversations = webClientService.conversations.conversations;
        conversations.forEach(function(conversation)
        {
            newUnread += conversation.unreadCount;
        });
    }
    catch (e)
    {
         console.log("serviceThreemaGetUnreadMessageCount ::: Catch");
    }
    

    if (newUnread !== unreadCount)
    {
        unreadCount = newUnread;

        // send back from webview to main
        ipcRenderer.sendToHost(unreadCount.toString());
        return unreadCount;
    }

    console.log("serviceThreemaGetUnreadMessageCount ::: Total Threema chats with unread messages: " + unreadCount);
}


ipcRenderer.on("request", function()
{
    ipcRenderer.sendToHost(serviceThreemaGetUnreadMessageCount());
});
