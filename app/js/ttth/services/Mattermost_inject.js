const {ipcRenderer} = require("electron");

/**
* @name serviceMattermostGetUnreadMessageCount
* @summary Gets the amount of unread messages of the service Mattermost
* @description Gets the amount of unread messages of the service Mattermost
*/
function serviceMattermostGetUnreadMessageCount()
{
    console.log("serviceMattermostGetUnreadMessageCount ::: Checking unread message count");

    const selectBadges = "#sidebarChannelContainer .unread-title.has-badge > span.badge";

    const pmUnread = Array.from(document.querySelectorAll(selectBadges)) .reduce((total, el) => total += parseInt(el.innerText), 0);
    console.log("serviceMattermostGetUnreadMessageCount ::: pmUnread: " + pmUnread);

    const channelsUnread = document.querySelectorAll("#sidebarChannelContainer .unread-title:not(.has-badge)").length;
    console.log("serviceMattermostGetUnreadMessageCount ::: channelsUnread: " + channelsUnread);

    const teamsUnread = document.querySelectorAll(".team-sidebar .team-container.unread").length;
    console.log("serviceMattermostGetUnreadMessageCount ::: teamsUnread: " + teamsUnread);

    // do the math
    var count = 0;
    count = count + pmUnread + channelsUnread + teamsUnread;
    console.log("serviceMattermostGetUnreadMessageCount ::: Overall: " + count);
    //count = channelsUnread + teamsUnread;

    console.log("serviceMattermostGetUnreadMessageCount ::: Total Mattermost chats with unread messages: " + count);

    // send back from webview to main
    ipcRenderer.sendToHost(count);
}


ipcRenderer.on("request", function()
{
    ipcRenderer.sendToHost(serviceMattermostGetUnreadMessageCount());
});
