/**
* @name serviceXingAddEventListener
* @summary Adds several event listener to Xing WebView
* @description Adds several event listener to Xing WebView
*/
function serviceXingAddEventListener()
{
    console.log("serviceXingAddEventListener ::: Start");

    // get webview
    var webview = document.getElementById("XingWebview");


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
        console.log("serviceXingAddEventListener ::: did-start-loading.");

        // Triggering search for unread messages
        webview.send("request");
    });


    // WebView Event: dom-ready
    //
    webview.addEventListener("dom-ready", function()
    {
        console.log("serviceXingAddEventListener ::: DOM-Ready");

        // Triggering search for unread messages
        webview.send("request");
    });


    // WebView Event: did-frame-finish-load
    //
    webview.addEventListener("did-frame-finish-load", function()
    {
        console.log("serviceXingAddEventListener ::: did-frame-finish-load.");
    });


    // WebView Event: did-stop-loading
    //
    webview.addEventListener("did-stop-loading", function()
    {
        console.log("serviceXingAddEventListener ::: did-stop-loading");

        // Triggering search for unread messages
        webview.send("request");
    });


    // WebView Event:  ipc-message
    webview.addEventListener("ipc-message",function(event)
    {
        console.log("serviceXingAddEventListener ::: IPC message:");
        console.log(event);
        console.info(event.channel);

        // update the badge
        updateServiceBadge("Xing", event.channel);
    });

    console.log("serviceXingAddEventListener ::: End");
}



/**
* @name serviceXingInit
* @summary Initializes the Xing Service
* @description Initializes the Xing Service
*/
function serviceXingInit(serviceName, serviceUrl)
{
    console.log("serviceXingInit ::: Start");

    // re-set the src for the webview
    //document.getElementById( serviceName + "Webview" ).setAttribute( "src", serviceUrl);
    document.getElementById( serviceName + "Webview" ).loadURL(serviceUrl);

    console.log("serviceXingInit ::: End");
}



// untested
function serviceXingUnload()
{
    var webview = document.getElementById("XingWebview");

    // remove all event listeners by cloning?
    var newWebView = webView.cloneNode(true);

    //webview.removeEventListener('dom-ready', loadPage);
}
