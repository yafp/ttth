/**
* @file discord_inject.js
* @fileOverview This script contains the inject code for the service discord
* @author yafp
* @namespace services
*/

const { ipcRenderer } = require('electron')

/**
* @function serviceDiscordGetUnreadMessageCount
* @summary Gets the amount of unread messages of the service discord
* @description Gets the amount of unread messages of the service discord
* @memberof services
*/
function serviceDiscordGetUnreadMessageCount () {
    console.log('serviceDiscordGetUnreadMessageCount ::: Checking unread message count')

    // via: https://github.com/TheGoddessInari/hamsket/blob/master/app/store/ServicesList.js
    let getMentionCount = badges => {
        let alerts = 0;
        for (const badge of badges) alerts += parseInt(badge.innerText, 10) || 0;
        return alerts
    },
    getServerUnread = badges => {
        let alerts = 0;
        for (const badge of badges) alerts += "1" === badge.style.opacity && "8px" === badge.style.height ? 1 : 0;
        return alerts
    },
    checkUnread = () => {
        const mentions = document.querySelectorAll(".lowerBadge-29hYVK > .numberBadge-2s8kKX");
        unread = document.getElementsByClassName("item-2hkk8m");
        const direct = getMentionCount(mentions);
        let indirect = getServerUnread(unread);
        indirect += document.getElementsByClassName("unread-3zKkbm").length,
        //hamsket.updateBadge(direct, indirect)
    };



    console.log('serviceDiscordGetUnreadMessageCount ::: Total Discord unread messages: ' + direct)

    // send back from webview to main
    ipcRenderer.sendToHost(direct.toString())
    return direct.toString()
}

ipcRenderer.on('request', function () {
    ipcRenderer.sendToHost(serviceDiscordGetUnreadMessageCount())
})
