function threemaStart()
{
    console.log("threemaStart ::: Start");

    // get webview
    var webview = document.getElementById("ThreemaWebview");


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
        console.log("threemaStart ::: did-start-loading.");

         webview.send("request");
    });


    // WebView Event: dom-ready
    //
    webview.addEventListener("dom-ready", function()
    {
        console.log("threemaStart ::: DOM-Ready");

         webview.send("request");
    });


    // WebView Event: did-frame-finish-load
    //
    webview.addEventListener("did-frame-finish-load", function()
    {
        console.log("threemaStart ::: did-frame-finish-load.");
    });


    // WebView Event: did-stop-loading
    //
    webview.addEventListener("did-stop-loading", function()
    {
        console.log("threemaStart ::: did-stop-loading");

        // Show devTools if you want
        //
        //webview.openDevTools();

        // Triggering search for unread messages
        webview.send("request");
    });


    // WebView Event:  ipc-message
    webview.addEventListener('ipc-message',function(event)
    {
        console.log("threemaStart ::: IPC message:");
        //console.log(event);
        //console.info(event.channel);

        // update the badge
        updateThreemaBadge(event.channel);
    });


    console.log("threemaStart ::: End");
}





function updateThreemaBadge(count)
{
    console.log("updateThreemaBadge ::: Start");

    // might be null - should be ignored
    if(count === null)
    {
        return;
    }

    console.log("updateThreemaBadge ::: New count is: " + count);

    if(count === 0)
    {
        count = "";
    }

    // update UI
    $( "#badge_threema" ).html( count );

    // Update tray icon status if needed
    updateTrayIconStatus();

    console.log("updateThreemaBadge ::: End");
}
