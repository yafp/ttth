/**
* @name serviceGoogleMessagesAddEventListener
* @summary Adds several EventListeners to the webview of the service
* @description Defines several EventListeners to the webview of the service and starts a periodic request to check for unread messages
*/
function serviceGoogleMessagesAddEventListener(serviceId)
{
    console.log("serviceGoogleMessagesAddEventListener ::: Start");

    console.log("serviceGoogleMessagesAddEventListener ::: Adding event listeners for webview: _webview_" + serviceId + "_.");

    // get webview
    var webview = document.getElementById("webview" + serviceId);


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
        console.log("serviceGoogleMessagesAddEventListener ::: did-start-loading.");

        // Triggering search for unread messages
        webview.send("request");
    });


    // WebView Event: dom-ready
    //
    webview.addEventListener("dom-ready", function()
    {
        console.log("serviceGoogleMessagesAddEventListener ::: DOM-Ready");

        // Triggering search for unread messages
        webview.send("request");
    });


    // WebView Event: did-stop-loading
    //
    webview.addEventListener("did-stop-loading", function()
    {
        console.log("serviceGoogleMessagesAddEventListener ::: did-stop-loading");

        // Triggering search for unread messages
        webview.send("request");
    });


    // WebView Event:  ipc-message
    webview.addEventListener("ipc-message",function(event)
    {
        console.log("serviceGoogleMessagesAddEventListener ::: IPC message:");

        // update the badge
        updateServiceBadge(serviceId, event.channel);
    });


    console.log("serviceGoogleMessagesAddEventListener ::: End");
}




/**
* @name serviceGoogleMessagesInit
* @summary Initializes the GoogleMessages Service
* @description Initializes the GoogleMessages Service
*/
function serviceGoogleMessagesInit(serviceName, serviceUrl)
{
    console.log("serviceGoogleMessagesInit ::: Start");

    // re-set the src for the webview
    //document.getElementById( serviceName + "Webview" ).setAttribute( "src", serviceUrl);
    document.getElementById( serviceName + "Webview" ).loadURL(serviceUrl);

    console.log("serviceGoogleMessagesInit ::: End");
}
