/**
* @name serviceGoogleMailAddEventListener
* @summary Adds several EventListeners to the webview of the service
* @description Defines several EventListeners to the webview of the service and starts a periodic request to check for unread messages
*/
function serviceGoogleMailAddEventListener(serviceId)
{
    console.log("serviceGoogleMailAddEventListener ::: Start");

    console.log("serviceGoogleMailAddEventListener ::: Adding event listeners for webview: _webview_" + serviceId + "_.");

    // get webview
    var webview = document.getElementById("webview_" + serviceId);


    // run it periodically
    //
    //  5.000 =  5 sec
    // 15.000 = 15 sec
    var intervalID = setInterval(function()
    {
        webview.send("request");
    }, 30000);


    // WebView Event: new-window
    //
    webview.addEventListener("new-window", function(e)
    {
        console.log("serviceGoogleMessagesAddEventListener ::: new-window");

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
        console.log("serviceGoogleMailAddEventListener ::: did-start-loading.");

        // Triggering search for unread messages
        webview.send("request");
    });


    // WebView Event: dom-ready
    //
    webview.addEventListener("dom-ready", function()
    {
        console.log("serviceGoogleMailAddEventListener ::: DOM-Ready");

        // Triggering search for unread messages
        webview.send("request");
    });


    // WebView Event: did-frame-finish-load
    //
    webview.addEventListener("did-frame-finish-load", function()
    {
        console.log("serviceGoogleMailAddEventListener ::: did-frame-finish-load.");
    });


    // WebView Event: did-stop-loading
    //
    webview.addEventListener("did-stop-loading", function()
    {
        console.log("serviceGoogleMailAddEventListener ::: did-stop-loading");

        // Triggering search for unread messages
        webview.send("request");
    });


    // WebView Event:  ipc-message
    webview.addEventListener("ipc-message",function(event)
    {
        console.log("serviceGoogleMailAddEventListener ::: IPC message:");

        // update the badge
        updateServiceBadge(serviceId, event.channel);
    });

    console.log("serviceGoogleMailAddEventListener ::: End");
}



/**
* @name serviceGoogleMailInit
* @summary Initializes the GoogleMail Service
* @description Initializes the GoogleMail Service
*/
function serviceGoogleMailInit(serviceName, serviceUrl)
{
    console.log("serviceGoogleMailInit ::: Start");

    // re-set the src for the webview
    //document.getElementById( serviceName + "Webview" ).setAttribute( "src", serviceUrl);
    document.getElementById( serviceName + "Webview" ).loadURL(serviceUrl);

    console.log("serviceGoogleMailInit ::: End");
}
