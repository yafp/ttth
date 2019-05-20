/**
* @name serviceMattermostAddEventListener
* @summary Adds several EventListeners to the webview of the service
* @description Defines several EventListeners to the webview of the service and starts a periodic request to check for unread messages
*/
function serviceMattermostAddEventListener()
{
    console.log("serviceMattermostAddEventListener ::: Start");

    // get webview
    var webview = document.getElementById("MattermostWebview");

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
        console.log("serviceMattermostAddEventListener ::: did-start-loading.");
        webview.send("request");
    });

    // WebView Event: dom-ready
    //
    webview.addEventListener("dom-ready", function()
    {
        console.log("serviceMattermostAddEventListener ::: DOM-Ready");
        webview.send("request");
    });

    // WebView Event: did-stop-loading
    //
    webview.addEventListener("did-stop-loading", function()
    {
        console.log("serviceMattermostAddEventListener ::: did-stop-loading");

        // Show devTools if you want
        //webview.openDevTools();

        // Triggering search for unread messages
        webview.send("request");
    });

    // WebView Event:  ipc-message
    webview.addEventListener("ipc-message",function(event)
    {
        console.log("serviceMattermostAddEventListener ::: IPC message:");
        //console.log(event);
        //console.info(event.channel);

        // update the badge
        updateMattermostBadge(event.channel);
    });

    console.log("serviceMattermostAddEventListener ::: End");
}


/**
* @name updateMattermostBadge
* @summary Update the mattermost badge
* @description Gets the current unread message count and adjust the badge according to it
* @param count - Amount of unread messages
*/
function updateMattermostBadge(count)
{
    console.log("updateMattermostBadge ::: Start");

    // might be null - should be ignored
    if(count === null)
    {
        return;
    }

    if(count === 0)
    {
        count = "";
    }

    console.log("updateMattermostBadge ::: New badge value is: " + count);

    // update UI
    $( "#badge_mattermost" ).html( count );

    // Update tray icon status if needed
    updateTrayIconStatus();

    console.log("updateMattermostBadge ::: End");
}
