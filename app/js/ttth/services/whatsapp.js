/**
* @name serviceWhatsAppAddEventListener
* @summary Adds several event listener to WhatsApp WebView
* @description Adds several event listener to WhatsApp WebView
*/
function serviceWhatsAppAddEventListener()
{
    console.log("serviceWhatsAppAddEventListener ::: Start");

    // get webview
    var webview = document.getElementById("WhatsAppWebview");


    // run it periodically
    //
    //  5.000 =  5 sec
    // 15.000 = 15 sec
    //
    var intervalID = setInterval(function()
    {
        webview.send("request");
    }, 5000);



    // WebView Event: new-window
    //
    webview.addEventListener("new-window", function(e)
    {
        console.log("serviceWhatsAppAddEventListener ::: new-window");

        const BrowserWindow = require("electron");
        const shell = require("electron").shell;
        const protocol = require("url").parse(e.url).protocol;

        if (protocol === "http:" || protocol === "https:")
        {
            shell.openExternal(e.url);
        }
    });


    // WebView Event: did-stop-loading
    //
    webview.addEventListener("did-stop-loading", function()
    {
        console.log("serviceWhatsAppAddEventListener ::: did-stop-loading");

        // Show devTools if you want
        //
        //webview.openDevTools();

        // Triggering search for unread messages
        webview.send("request");
    });


    // WebView Event:  ipc-message
    webview.addEventListener("ipc-message",function(event)
    {
        console.log("serviceWhatsAppAddEventListener ::: IPC message:");
        //console.log(event);
        //console.error(event.channel);

        // update the badge
        //
        //serviceWhatsAppUpdateBadge(event.channel); // Baustelle
        updateServiceBadge("WhatsApp", event.channel); // Baustelle
    });

    console.log("serviceWhatsAppAddEventListener ::: End");
}


/**
* @name serviceWhatsAppRegister
* @summary Register WhatsApp Web sessions
* @description Flushes the storage data, clears the storage data -> helps running WhatsApp-Web
*/
function serviceWhatsAppRegister()
{
    // via: https://github.com/meetfranz/franz/issues/1185

    console.log("serviceWhatsAppRegister ::: Start");

    console.log("serviceWhatsAppRegister ::: Trying to fix WhatsApp-Web connectivity issues");

    const {remote} = require("electron"); //Imports the remote module to use session inside webview
    const { session } = require("electron");
    var ses = remote.session.defaultSession; //Gets the default session
    //ses.clearCache();
    ses.flushStorageData();
    ses.clearStorageData({ //Clears the specified storages in the session
        storages: ["appcache", "serviceworkers", "cachestorage", "websql", "indexdb"],
    });

    window.navigator.serviceWorker.getRegistrations().then(registrations => {
        for (let registration of registrations)
        {
            registration.unregister(); //Unregisters all the service workers
        }
    });


    console.log("serviceWhatsAppRegister ::: End");
}



function serviceWhatsAppInit()
{
    console.log("serviceWhatsAppInit ::: Start");

    document.getElementById( "WhatsAppWebview" ).setAttribute( "src", "https://web.whatsapp.com/");

    serviceWhatsAppRegister();

    console.log("serviceWhatsAppInit ::: End");
}
