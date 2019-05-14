function slackStart()
{
    console.log("slackStart ::: Start");

    // get webview
    var webview = document.getElementById("SlackWebview");

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
        console.log("slackStart ::: did-start-loading.");
        webview.send("request");
    });


    // WebView Event: dom-ready
    //
    webview.addEventListener("dom-ready", function()
    {
        console.log("slackStart ::: DOM-Ready");
        webview.send("request");
    });


    // WebView Event: did-frame-finish-load
    //
    webview.addEventListener("did-frame-finish-load", function()
    {
        console.log("slackStart ::: did-frame-finish-load.");
    });


    // WebView Event: did-stop-loading
    //
    webview.addEventListener("did-stop-loading", function()
    {
        console.log("slackStart ::: did-stop-loading");

        // Show devTools if you want
        //
        //webview.openDevTools();

        // Triggering search for unread messages
        webview.send("request");
    });


    // WebView Event:  ipc-message
    webview.addEventListener('ipc-message',function(event)
    {
        console.log("slackStart ::: IPC message:");
        //console.log(event);
        //console.info(event.channel);

        // update the badge
        updateSlackBadge(event.channel);
    });

    console.log("slackStart ::: End");
}





function updateSlackBadge(count)
{
    console.log("updateSlackBadge ::: Start");

    // might be null - should be ignored
    if(count === null)
    {
        return;
    }

    console.log("updateSlackBadge ::: New count is: " + count);

    if(count === 0)
    {
        count = "";
    }

    // update UI
    $( "#badge_slack" ).html( count );

    // Update tray icon status if needed
    updateTrayIconStatus();

    console.log("updateSlackBadge ::: End");
}
