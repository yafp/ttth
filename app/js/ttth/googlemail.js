function updateGoogleMailBadge(count)
{
    console.log("updateGoogleMailBadge ::: Start");

    // might be null - should be ignored
    if(count === null)
    {
        return;
    }

    console.log("updateGoogleMailBadge ::: New count is: " + count);

    if(count === 0)
    {
        count = "";
    }

    // update UI
    $( "#badge_googlemail" ).html( count );

    // Update tray icon status if needed
    updateTrayIconStatus();

    console.log("updateGoogleMailBadge ::: End");
}


function googlemailStart()
{
    console.log("googlemailStart ::: Start");

    // get webview
    var webview = document.getElementById("GoogleMailWebview");


    // run it periodically
    //
    //  5.000 =  5 sec
    // 15.000 = 15 sec
    var intervalID = setInterval(function()
    {
        webview.send("request");
    }, 30000);


    // WebView Event: did-start-loading
    //
    webview.addEventListener("did-start-loading", function()
    {
        console.log("googlemailStart ::: did-start-loading.");

         webview.send("request");
    });


    // WebView Event: dom-ready
    //
    webview.addEventListener("dom-ready", function()
    {
        console.log("googlemailStart ::: DOM-Ready");

         webview.send("request");
    });


    // WebView Event: did-frame-finish-load
    //
    webview.addEventListener("did-frame-finish-load", function()
    {
        console.log("googlemailStart ::: did-frame-finish-load.");
    });


    // WebView Event: did-stop-loading
    //
    webview.addEventListener("did-stop-loading", function()
    {
        console.log("googlemailStart ::: did-stop-loading");

        // Show devTools if you want
        //
        //webview.openDevTools();

        // Triggering search for unread messages
        webview.send("request");
    });


    // WebView Event:  ipc-message
    webview.addEventListener("ipc-message",function(event)
    {
        console.log("googlemailStart ::: IPC message:");

        // update the badge
        updateGoogleMailBadge(event.channel);
    });


    console.log("googlemailStart ::: End");
}
