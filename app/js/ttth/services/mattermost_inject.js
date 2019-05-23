// Get the ipcRenderer of electron
const {ipcRenderer} = require("electron");

/**
* @name serviceMattermostGetUnreadMessageCount
* @summary Gets the amount of unread messages of the service Mattermost
* @description Gets the amount of unread messages of the service Mattermost
*/
function serviceMattermostGetUnreadMessageCount()
{
    console.log("serviceMattermostGetUnreadMessageCount ::: Start");

    const selectBadges = "#sidebarChannelContainer .unread-title.has-badge > span.badge";
    const pmUnread = Array.from(document.querySelectorAll(selectBadges)) .reduce((total, el) => total += parseInt(el.innerText), 0);
    //if (pmUnread) return updateBadge(pmUnread);
    const channelsUnread = document.querySelectorAll("#sidebarChannelContainer .unread-title:not(.has-badge)").length;
    const teamsUnread = document.querySelectorAll(".team-sidebar .team-container.unread").length;

    var counter = channelsUnread + teamsUnread;

    console.log("serviceMattermostGetUnreadMessageCount ::: Total Mattermost chats with unread messages: " + counter);

    // send back from webview to main
    ipcRenderer.sendToHost(counter);
}


// Do something according to a request of your mainview
ipcRenderer.on("request", function()
{
    ipcRenderer.sendToHost(serviceMattermostGetUnreadMessageCount());
});
