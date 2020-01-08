'use strict'

/**
* @name openURL
* @summary Opens an url in browser
* @description Opens a given url in default browser. This is pretty slow, but got no better solution so far.
* @param url - URL string which contains the target url
*/
function openURL (url) {
    const { shell } = require('electron')
    shell.openExternal(url)
}

/**
* @name getHostName
* @summary Parsing the Hostname From a Url
* @description Parsing the Hostname From a Url
* @param url
*/
function getHostName (url) {
    var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i)
    if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
        return match[2]
    } else {
        return null
    }
}

/**
* @name getDomain
* @summary Parsing the Domain From a Url
* @description Parsing the Domain From a Url
* @param url
* @return domain
*/
function getDomain (url) {
    var hostName = getHostName(url)
    var domain = hostName

    if (hostName != null) {
        var parts = hostName.split('.').reverse()

        if (parts != null && parts.length > 1) {
            domain = parts[1] + '.' + parts[0]

            if (hostName.toLowerCase().indexOf('.co.uk') !== -1 && parts.length > 2) {
                domain = parts[2] + '.' + domain
            }
        }
    }
    return domain
}

module.exports.openURL = openURL
module.exports.getHostName = getHostName
module.exports.getDomain = getDomain
