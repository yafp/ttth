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
    }, 5000);


    // WebView Event: new-window / clicking links
    //
    webview.addEventListener("new-window", function(e)
    {
        console.log("serviceMattermostAddEventListener ::: new-window");

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
        console.log("serviceMattermostAddEventListener ::: did-start-loading.");

        // Triggering search for unread messages
        webview.send("request");
    });


    // WebView Event: dom-ready
    //
    webview.addEventListener("dom-ready", function()
    {
        console.log("serviceMattermostAddEventListener ::: DOM-Ready");

        // Triggering search for unread messages
        webview.send("request");
    });


    // WebView Event: did-stop-loading
    //
    webview.addEventListener("did-stop-loading", function()
    {
        console.log("serviceMattermostAddEventListener ::: did-stop-loading");

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
        updateServiceBadge("Mattermost", event.channel);
    });

    console.log("serviceMattermostAddEventListener ::: End");
}




/**
* @name serviceMattermostInit
* @summary Initializes the Mattermost Service
* @description Initializes the Mattermost Service
*/
function serviceMattermostInit(serviceName, serviceUrl)
{
    console.log("serviceMattermostInit ::: Start");

    // re-set the src for the webview
    //document.getElementById( serviceName + "Webview" ).setAttribute( "src", serviceUrl);
    document.getElementById( serviceName + "Webview" ).loadURL(serviceUrl);

    console.log("serviceMattermostInit ::: End");
}
