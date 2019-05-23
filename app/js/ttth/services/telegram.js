/**
* @name serviceTelegramAddEventListener
* @summary Adds several EventListeners to the webview of the service
* @description Defines several EventListeners to the webview of the service and starts a periodic request to check for unread messages
*/
function serviceTelegramAddEventListener()
{
    console.log("serviceTelegramAddEventListener ::: Start");

    // get webview
    var webview = document.getElementById("TelegramWebview");

    // run it periodically
    //
    //  5.000 =  5 sec
    var intervalID = setInterval(function()
    {
        webview.send("request");
    }, 10000);


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
        console.log("serviceTelegramAddEventListener ::: did-start-loading.");
        webview.send("request");
    });

    // WebView Event: dom-ready
    //
    webview.addEventListener("dom-ready", function()
    {
        console.log("serviceTelegramAddEventListener ::: DOM-Ready");
        webview.send("request");
    });

    // WebView Event: did-frame-finish-load
    //
    /*
    webview.addEventListener("did-frame-finish-load", function()
    {
        console.log("telegramStart ::: did-frame-finish-load.");
    });
    */

    // WebView Event: did-stop-loading
    //
    webview.addEventListener("did-stop-loading", function()
    {
        console.log("serviceTelegramAddEventListener ::: did-stop-loading");

        // Show devTools if you want
        //webview.openDevTools();

        // Triggering search for unread messages
        webview.send("request");
    });

    // WebView Event:  ipc-message
    webview.addEventListener("ipc-message",function(event)
    {
        console.log("serviceTelegramAddEventListener ::: IPC message:");
        //console.log(event);
        //console.info(event.channel);

        // update the badge
        updateServiceBadge("Telegram", event.channel);
    });

    console.log("serviceTelegramAddEventListener ::: End");
}
