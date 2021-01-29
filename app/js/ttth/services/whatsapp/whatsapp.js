/**
* @file whatsapp.js
* @fileOverview This module contains the code for the service whatsapp
* @author yafp
* @namespace services
*/

/**
* @function serviceWhatsAppRegister
* @summary Register WhatsApp Web sessions
* @description Flushes the storage data, clears the storage data -> helps running WhatsApp-Web
* @memberof services
*/
function serviceWhatsAppRegister () {
    // via: https://github.com/meetfranz/franz/issues/1185
    console.log('serviceWhatsAppRegister ::: Trying to fix WhatsApp-Web connectivity issues')

    const { remote } = require('electron') // Imports the remote module to use session inside webview
    // const { session } = require('electron')

    const ses = remote.session.defaultSession // Gets the default session

    // ses.clearCache();
    ses.flushStorageData() // Writes any unwritten DOMStorage data to disk.
    ses.clearStorageData(
        {
        // Clears the storage data for the current session.
        // Clears the specified storages in the session
            storages: ['appcache', 'serviceworkers', 'cachestorage', 'websql', 'indexdb']
        })

    window.navigator.serviceWorker.getRegistrations().then(registrations => {
        for (const registration of registrations) {
            registration.unregister() // Unregisters all the service workers
        }
    })
}

/**
* @function serviceWhatsAppInit
* @summary Initializes the WhatsApp Service
* @description Initializes the WhatsApp Service
* @memberof services
* @todo This seems like it is not in use so far.
*/
function serviceWhatsAppInit (serviceName, serviceUrl) { // eslint-disable-line no-unused-vars
    console.log('serviceWhatsAppInit ::: Trying to init WhatsApp')

    // re-set the src for the webview
    // document.getElementById( serviceName + "Webview" ).setAttribute( "src", serviceUrl);
    document.getElementById('webview_whatsapp').loadURL(serviceUrl)

    // register
    serviceWhatsAppRegister()
}
