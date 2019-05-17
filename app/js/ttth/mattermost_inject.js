// Get the ipcRenderer of electron
const {ipcRenderer} = require("electron");


// Do something according to a request of your mainview
ipcRenderer.on("request", function()
{
    ipcRenderer.sendToHost(getUnreadMattermostMessageCount());
});


function getUnreadMattermostMessageCount()
{
    console.log("getUnreadMattermostMessageCount ::: Start");


    const selectBadges = "#sidebarChannelContainer .unread-title.has-badge > span.badge"; 
    const pmUnread = Array.from(document.querySelectorAll(selectBadges)) .reduce((total, el) => total += parseInt(el.innerText), 0); 
    if (pmUnread) return updateBadge(pmUnread); 
    const channelsUnread = document.querySelectorAll("#sidebarChannelContainer .unread-title:not(.has-badge)").length; 
    const teamsUnread = document.querySelectorAll(".team-sidebar .team-container.unread").length; 

    counter = channelsUnread + teamsUnread; 

    console.log("getUnreadMattermostMessageCount ::: Total Mattermost chats with unread messages: " + counter);

    // send back from webview to main
    ipcRenderer.sendToHost(counter);

    //return counter;
}
