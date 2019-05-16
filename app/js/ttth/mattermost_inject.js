// Get the ipcRenderer of electron
const {ipcRenderer} = require("electron");


// Do something according to a request of your mainview
//
ipcRenderer.on("request", function()
{
    console.log("request ::: Start");
    ipcRenderer.sendToHost(getUnreadMattermostMessageCount());
    console.log("request ::: End");
});


/*
ipcRenderer.on("alert-something",function(event,data)
{
    alert(data);
});
*/

/*
ipcRenderer.on("change-text-element",function(event,data)
{
    // the document references to the document of the <webview>
    document.getElementById(data.id).innerHTML = data.text;
});
*/


/**
 **/
function getUnreadMattermostMessageCount()
{
    console.log("getUnreadMattermostMessageCount ::: Start");

    function checkUnread() 
    {
        const selectBadges = "#sidebarChannelContainer .unread-title.has-badge > span.badge"; 
        const pmUnread = Array.from(document.querySelectorAll(selectBadges)) .reduce((total, el) => total += parseInt(el.innerText), 0); 
        if (pmUnread) return updateBadge(pmUnread); 
        const channelsUnread = document.querySelectorAll("#sidebarChannelContainer .unread-title:not(.has-badge)").length; 
        const teamsUnread = document.querySelectorAll(".team-sidebar .team-container.unread").length; 

        //updateBadge((channelsUnread + teamsUnread) > 0); 

        counter = channelsUnread + teamsUnread; 




    console.log("getUnreadTelegramMessageCount ::: Total Telegram chats with unread messages: " + counter);

    // send back from webview to main
    ipcRenderer.sendToHost(counter);

    return counter;
    
}
