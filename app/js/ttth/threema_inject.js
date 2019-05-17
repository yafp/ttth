// Get the ipcRenderer of electron
const {ipcRenderer} = require("electron");


// Do something according to a request of your mainview
ipcRenderer.on("request", function()
{
    ipcRenderer.sendToHost(getUnreadThreemaMessageCount());
});


function getUnreadThreemaMessageCount()
{
    console.log("getUnreadThreemaMessageCount ::: Start");

    let newUnread = 0;
    try 
    {
        //let webClientService = angular.element(document.documentElement).injector().get(\'WebClientService\');
        //
        let webClientService = angular.element(document.documentElement).injector().get('WebClientService');
        let conversations = webClientService.conversations.conversations; 
        conversations.forEach(function(conversation) 
        { 
            newUnread += conversation.unreadCount; 
        }); 
    } 
    catch (e) 
    { 

    } 

    if (newUnread !== unreadCount) 
    { 
        unreadCount = newUnread; 

        // send back from webview to main
        ipcRenderer.sendToHost(unreadCount);

    } 

    console.log("getUnreadThreemaMessageCount ::: Total Threema chats with unread messages: " + unreadCount);
}















