/**
* @name serviceWhatsAppRegister
* @summary Register WhatsApp Web sessions
* @description Flushes the storage data, clears the storage data -> helps running WhatsApp-Web
*/
function serviceWhatsAppRegister()
{
    // via: https://github.com/meetfranz/franz/issues/1185
    console.log("serviceWhatsAppRegister ::: Trying to fix WhatsApp-Web connectivity issues");

    const {remote} = require("electron"); //Imports the remote module to use session inside webview
    const {session} = require("electron");

    var ses = remote.session.defaultSession; //Gets the default session
    
    //ses.clearCache();
    ses.flushStorageData();
    ses.clearStorageData(
    { 
        //Clears the specified storages in the session
        storages: ["appcache", "serviceworkers", "cachestorage", "websql", "indexdb"],
    });

    window.navigator.serviceWorker.getRegistrations().then(registrations => {
        for (let registration of registrations)
        {
            registration.unregister(); //Unregisters all the service workers
        }
    });
}


/**
* @name serviceWhatsAppInit
* @summary Initializes the WhatsApp Service
* @description Initializes the WhatsApp Service
*/
function serviceWhatsAppInit(serviceName, serviceUrl)
{
    console.log("serviceWhatsAppInit ::: Trying to init WhatsApp");

    // re-set the src for the webview
    //document.getElementById( serviceName + "Webview" ).setAttribute( "src", serviceUrl);
    document.getElementById( "webview_whatsapp" ).loadURL(serviceUrl);

     // register
    serviceWhatsAppRegister();
}
