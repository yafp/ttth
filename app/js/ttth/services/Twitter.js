/**
* @name serviceTwitterAddEventListener
* @summary Adds several event listener to Twitter WebView
* @description Adds several event listener to Twitter WebView
*/
function serviceTwitterAddEventListener(serviceId)
{
    console.log("serviceTwitterAddEventListener ::: Start");

    console.log("serviceTwitterAddEventListener ::: Adding event listeners for webview: _webview_" + serviceId + "_.");

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


    // WebView Event: did-start-loading
    //
    webview.addEventListener("did-start-loading", function()
    {
        console.log("serviceTwitterAddEventListener ::: did-start-loading.");

        // Triggering search for unread messages
        webview.send("request");
    });


    // WebView Event: dom-ready
    //
    webview.addEventListener("dom-ready", function()
    {
        console.log("serviceTwitterAddEventListener ::: DOM-Ready");

        // Triggering search for unread messages
        webview.send("request");
    });


    // WebView Event: did-frame-finish-load
    //
    webview.addEventListener("did-frame-finish-load", function()
    {
        console.log("serviceTwitterAddEventListener ::: did-frame-finish-load.");
    });


    // WebView Event: did-stop-loading
    //
    webview.addEventListener("did-stop-loading", function()
    {
        console.log("serviceTwitterAddEventListener ::: did-stop-loading");

        // Triggering search for unread messages
        webview.send("request");
    });


    // WebView Event:  ipc-message
    webview.addEventListener("ipc-message",function(event)
    {
        console.log("serviceTwitterAddEventListener ::: IPC message:");
        //console.log(event);
        //console.info(event.channel);

        // update the badge
        updateServiceBadge(serviceId, event.channel);
    });

    console.log("serviceThreemaAddEventListener ::: End");
}


/**
* @name serviceTwitterInit
* @summary Initializes the Twitter Service
* @description Initializes the Twitter Service
*/
function serviceTwitterInit(serviceName, serviceUrl)
{
    console.log("serviceTwitterInit ::: Start");

    // re-set the src for the webview
    //document.getElementById( serviceName + "Webview" ).setAttribute( "src", serviceUrl);
    document.getElementById( serviceName + "Webview" ).loadURL(serviceUrl);

    console.log("serviceTwitterInit ::: End");
}
