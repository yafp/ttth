/**
* @name serviceWhatsAppUpdateBadge
* @summary Updates the unread message badge of WhatsApp
* @description Updates the unread message badge of WhatsApp
*/
function serviceWhatsAppUpdateBadge(count)
{
    console.log("serviceWhatsAppUpdateBadge ::: Start");

    // might be null - should be ignored
    if(count === null)
    {
        return;
    }

    console.log("serviceWhatsAppUpdateBadge ::: New count is: " + count);

    if(count === 0)
    {
        count = "";
    }

    // update UI
    $( "#badge_whatsapp" ).html( count );

    // Update tray icon status if needed
    updateTrayIconStatus();

    console.log("serviceWhatsAppUpdateBadge ::: End");
}



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


    // communication between main & webview:
    // https://ourcodeworld.com/articles/read/201/how-to-send-retrieve-information-and-manipulate-the-dom-from-a-webview-with-electron-framework


    // WebView Events: https://electronjs.org/docs/api/webview-tag#dom-events
    //
    //


    // run it periodically
    //
    //  5.000 =  5 sec
    // 15.000 = 15 sec
    //
    var intervalID = setInterval(function()
    {
        webview.send("request");
    }, 5000);


    // WebView Event: did-start-loading
    //
    webview.addEventListener("did-start-loading", function()
    {
        console.log("serviceWhatsAppAddEventListener ::: did-start-loading.");
    });


    // WebView Event: dom-ready
    //
    webview.addEventListener("dom-ready", function()
    {
        console.log("serviceWhatsAppAddEventListener ::: DOM-Ready");
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
        serviceWhatsAppUpdateBadge(event.channel);
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

    // via: https://github.com/meetfranz/franz/issues/1185

    console.log("serviceWhatsAppRegister ::: End");
}
