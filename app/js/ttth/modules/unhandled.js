/**
* @file unhandled.js
* @fileOverview This module contains all unhandled functions, See: https://github.com/sindresorhus/electron-unhandled
* @author yafp
* @module unhandled
*/

'use strict'

// const utils = require('./utils.js')

const unhandled = require('electron-unhandled')
const { openNewGitHubIssue, debugInfo } = require('electron-util')

unhandled({
    showDialog: true,
    reportButton: error => {
        openNewGitHubIssue({
            user: 'yafp',
            repo: 'ttth',
            body: `\`\`\`\n${error.stack}\n\`\`\`\n\n---\n\n${debugInfo()}`
        })
    }
})

/**
* @function initUnhandled
* @summary Initializes electron-unhandled
* @description Initializes electron-unhandled. Is used in main and renderer
*/
function initUnhandled () {
    const unhandled = require('electron-unhandled')
    const { openNewGitHubIssue, debugInfo } = require('electron-util')

    unhandled({
        showDialog: true,
        reportButton: error => {
            openNewGitHubIssue({
                user: 'yafp',
                repo: 'ttth',
                body: `\`\`\`\n${error.stack}\n\`\`\`\n\n---\n\n${debugInfo()}`
            })
        }
    })

    // utils.writeConsoleMsg('info', 'initUnhandled ::: electron-unhandled is now initialized')
}

// export the functions
//
module.exports.initUnhandled = initUnhandled
