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


    // WebView Event: did-start-loading
    //
    webview.addEventListener("did-start-loading", function()
    {
        console.log("serviceWhatsAppAddEventListener ::: did-start-loading.");

        // Triggering search for unread messages
        webview.send("request");
    });


    // WebView Event: dom-ready
    //
    webview.addEventListener("dom-ready", function()
    {
        console.log("serviceWhatsAppAddEventListener ::: DOM-Ready");

        // Triggering search for unread messages
        webview.send("request");
    });


    // WebView Event: did-frame-finish-load
    //
    webview.addEventListener("did-frame-finish-load", function()
    {
        console.log("serviceWhatsAppAddEventListener ::: did-frame-finish-load.");
    });


    // WebView Event: did-stop-loading
    //
    webview.addEventListener("did-stop-loading", function()
    {
        console.log("serviceWhatsAppAddEventListener ::: did-stop-loading");

        // Debug: Open a separate Console Window for this WebView
        //webview.openDevTools();

        // Triggering search for unread messages
        webview.send("request");
    });


    // WebView Event:  ipc-message
    webview.addEventListener("ipc-message",function(event)
    {
        console.log("serviceWhatsAppAddEventListener ::: IPC message: _" + event + "_.");
        console.log(event);
        //console.log(event.channel);

        // update the badge
        if(event.channel != null)
        {
            updateServiceBadge("WhatsApp", event.channel); 
        }
    });


    //openDevTools();

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


/**
* @name serviceWhatsAppInit
* @summary Initializes the WhatsApp Service
* @description Initializes the WhatsApp Service
*/
function serviceWhatsAppInit(serviceName, serviceUrl)
{
    console.log("serviceWhatsAppInit ::: Start");

    // re-set the src for the webview
    //document.getElementById( serviceName + "Webview" ).setAttribute( "src", serviceUrl);
    document.getElementById( serviceName + "Webview" ).loadURL(serviceUrl);

     // register
    serviceWhatsAppRegister();

    console.log("serviceWhatsAppInit ::: End");
}
