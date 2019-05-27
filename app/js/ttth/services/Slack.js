/**
* @name serviceSlackAddEventListener
* @summary Adds several EventListeners to the webview of the service
* @description Defines several EventListeners to the webview of the service and starts a periodic request to check for unread messages
*/
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


    // WebView Event: new-window
    //
    webview.addEventListener("new-window", function(e)
    {
        console.log("serviceSlackAddEventListener ::: new-window");

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
        console.log("serviceSlackAddEventListener ::: did-start-loading.");

        // Triggering search for unread messages
        webview.send("request");
    });


    // WebView Event: dom-ready
    //
    webview.addEventListener("dom-ready", function()
    {
        console.log("serviceSlackAddEventListener ::: DOM-Ready");

        // Triggering search for unread messages
        webview.send("request");
    });


    // WebView Event: did-stop-loading
    //
    webview.addEventListener("did-stop-loading", function()
    {
        console.log("serviceSlackAddEventListener ::: did-stop-loading");

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
        updateServiceBadge("Slack", event.channel);
    });

    console.log("serviceSlackAddEventListener ::: End");
}



/**
* @name serviceSlackInit
* @summary Initializes the Slack Service
* @description Initializes the Slack Service
*/
function serviceSlackInit(serviceName, serviceUrl)
{
    console.log("serviceSlackInit ::: Start");

    // re-set the src for the webview
    //document.getElementById( serviceName + "Webview" ).setAttribute( "src", serviceUrl);
    document.getElementById( serviceName + "Webview" ).loadURL(serviceUrl);

    console.log("serviceSlackInit ::: End");
}
