/**
* @name serviceThreemaAddEventListener
* @summary Adds several event listener to Threema WebView
* @description Adds several event listener to Threema WebView
*/
function serviceThreemaAddEventListener()
{
    console.log("serviceThreemaAddEventListener ::: Start");

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
        console.log("serviceThreemaAddEventListener ::: did-start-loading.");
        webview.send("request");
    });


    // WebView Event: dom-ready
    //
    webview.addEventListener("dom-ready", function()
    {
        console.log("serviceThreemaAddEventListener ::: DOM-Ready");
        webview.send("request");
    });


    // WebView Event: did-frame-finish-load
    //
    webview.addEventListener("did-frame-finish-load", function()
    {
        console.log("serviceThreemaAddEventListener ::: did-frame-finish-load.");
    });


    // WebView Event: did-stop-loading
    //
    webview.addEventListener("did-stop-loading", function()
    {
        console.log("serviceThreemaAddEventListener ::: did-stop-loading");

        // Triggering search for unread messages
        webview.send("request");
    });


    // WebView Event:  ipc-message
    webview.addEventListener("ipc-message",function(event)
    {
        console.log("serviceThreemaAddEventListener ::: IPC message:");
        //console.log(event);
        //console.info(event.channel);

        // update the badge
        updateServiceBadge("Threema", event.channel);
    });

    console.log("serviceThreemaAddEventListener ::: End");
}
