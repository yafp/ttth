
function serviceSlackUpdateBadge(count)
{
    console.log("serviceSlackUpdateBadge ::: Start");

    // might be null - should be ignored
    if(count === null)
    {
        return;
    }

    console.log("serviceSlackUpdateBadge ::: New count is: " + count);

    if(count === 0)
    {
        count = "";
    }

    // update UI
    $( "#badge_slack" ).html( count );

    // Update tray icon status if needed
    updateTrayIconStatus();

    console.log("serviceSlackUpdateBadge ::: End");
}



function serviceSlackAddEventListener()
{
    console.log("serviceSlackAddEventListener ::: Start");

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
        console.log("serviceSlackAddEventListener ::: did-start-loading.");
        webview.send("request");
    });


    // WebView Event: dom-ready
    //
    webview.addEventListener("dom-ready", function()
    {
        console.log("serviceSlackAddEventListener ::: DOM-Ready");
        webview.send("request");
    });


    // WebView Event: did-stop-loading
    //
    webview.addEventListener("did-stop-loading", function()
    {
        console.log("serviceSlackAddEventListener ::: did-stop-loading");

        // Show devTools if you want
        //
        //webview.openDevTools();

        // Triggering search for unread messages
        webview.send("request");
    });


    // WebView Event:  ipc-message
    webview.addEventListener("ipc-message",function(event)
    {
        console.log("serviceSlackAddEventListener ::: IPC message:");
        //console.log(event);
        //console.info(event.channel);

        // update the badge
        serviceSlackUpdateBadge(event.channel);
    });

    console.log("serviceSlackAddEventListener ::: End");
}
