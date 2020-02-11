/**
* @file discord_inject.js
* @fileOverview This script contains the inject code for the service discord
* @author yafp
* @namespace services
*/

const { ipcRenderer } = require('electron')

/**
* @function serviceDiscordGetAlertCount
* @summary Gets the alert count of the service discord
* @description Gets the alert count of the service discord
* @memberof services
*/
function serviceDiscordGetAlertCount (badges) {
    var alerts = 0
    for (var i = 0; i < badges.length; i++) {
        var badge = badges[i]
        if (badge && badge.childNodes && badge.childNodes.length > 0) {
            var count = parseInt(badge.childNodes[0].nodeValue, 10)
            alerts += count.isNaN
                ? 1
                : count
        } else {
            alerts++
        }
    }
    return alerts
}

/**
* @function serviceDiscordGetUnreadMessageCount
* @summary Gets the amount of unread messages of the service discord
* @description Gets the amount of unread messages of the service discord
* @memberof services
*/
function serviceDiscordGetUnreadMessageCount () {
    console.log('serviceDiscordGetUnreadMessageCount ::: Checking unread message count')

    var direct = 0
    // var indirect = document.querySelectorAll('.guilds-wrapper .unread').length
    var guildDirect = document.querySelectorAll('.guilds-wrapper .badge')
    var channelDirect = document.querySelectorAll('[class^="nameUnreadText-"]+div>div>div')

    direct += serviceDiscordGetAlertCount(guildDirect)
    direct += serviceDiscordGetAlertCount(channelDirect)
    // indirect += document.querySelectorAll('[class^="nameUnreadText-"]').length

    console.log('serviceDiscordGetUnreadMessageCount ::: Total Discord unread messages: ' + direct)

    // send back from webview to main
    ipcRenderer.sendToHost(direct.toString())
    return direct.toString()
}

ipcRenderer.on('request', function () {
    ipcRenderer.sendToHost(serviceDiscordGetUnreadMessageCount())
})
