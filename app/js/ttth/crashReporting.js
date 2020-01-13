// ----------------------------------------------------------------------------
// Error Handling using: crashReporter (https://electronjs.org/docs/api/crash-reporter)
// ----------------------------------------------------------------------------
//
const { crashReporter } = require('electron')
crashReporter.start({
    productName: 'ttth',
    companyName: 'yafp',
    submitURL: 'https://sentry.io/api/1757940/minidump/?sentry_key=bbaa8fa09ca84a8da6a545c04d086859',
    uploadToServer: false
})
// To simulate a crash - execute: process.crash();

// ----------------------------------------------------------------------------
// Error Handling using: sentry (see #106)
// ----------------------------------------------------------------------------
//
// https://sentry.io/organizations/yafp/
// https://docs.sentry.io/platforms/javascript/electron/
//
const Sentry = require('@sentry/electron')
Sentry.init({
    dsn: 'https://bbaa8fa09ca84a8da6a545c04d086859@sentry.io/1757940',
    debug: true
})
//
// simple way to force a crash:
// myUndefinedFunction();

function enableSentry () {
    Sentry.getCurrentHub().getClient().getOptions().enabled = true
    console.log('Sentry is now enabled')
}

function disableSentry () {
    Sentry.getCurrentHub().getClient().getOptions().enabled = false
    console.warn('Sentry is now disabled')
}

// export both functions
// exports.enableSentry = enableSentry
// exports.disableSentry = disableSentry

// ----------------------------------------------------------------------------
// Error Handling using: electron-unhandled (https://github.com/sindresorhus/electron-unhandled)
// ----------------------------------------------------------------------------
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
