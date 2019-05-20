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
    }, 30000);

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
        updateTelegramBadge(event.channel);
    });

    console.log("serviceTelegramAddEventListener ::: End");
}


/**
* @name updateTelegramBadge
* @summary Update the telegram badge
* @description Gets the current unread message count and adjust the badge according to it
* @param count - Amount of unread messages
*/
function updateTelegramBadge(count)
{
    console.log("updateTelegramBadge ::: Start");

    // might be null - should be ignored
    if(count === null)
    {
        return;
    }

    if(count === 0)
    {
        count = "";
    }

    console.log("updateTelegramBadge ::: New badge value is: " + count);

    // update UI
    $( "#badge_telegram" ).html( count );

    // Update tray icon status if needed
    updateTrayIconStatus();

    console.log("updateTelegramBadge ::: End");
}
