/**
* @file crashReporter.js
* @fileOverview This module contains all crashReporter functions, See: https://electronjs.org/docs/api/crash-reporter
* @author yafp
* @module crashReporter
*/

'use strict'

/**
* @name initCrashReporter
* @summary Initialized the crashReporter
* @description Initialized the crashReporter. See: https://electronjs.org/docs/api/crash-reporter
*/
function initCrashReporter () {
    const { crashReporter } = require('electron')
    crashReporter.start({
        productName: 'ttth',
        companyName: 'yafp',
        submitURL: 'https://sentry.io/api/1757940/minidump/?sentry_key=bbaa8fa09ca84a8da6a545c04d086859',
        uploadToServer: false
    })

    // To simulate a crash - execute: process.crash();
}

// export functions
//
module.exports.initCrashReporter = initCrashReporter
