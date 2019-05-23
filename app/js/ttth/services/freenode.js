/**
* @name serviceFreenodeAddEventListener
* @summary Adds several event listener to Freenode WebView
* @description Adds several event listener to Freenode WebView
*/
function serviceFreenodeAddEventListener()
{
    console.log("serviceFreenodeAddEventListener ::: Start");

    // get webview
    var webview = document.getElementById("FreenodeWebview");

    // WebView Event: new-window
    //
    webview.addEventListener("new-window", function(e)
    {
        console.log("serviceFreenodeAddEventListener ::: new-window");

        const BrowserWindow = require("electron");
        const shell = require("electron").shell;
        const protocol = require("url").parse(e.url).protocol;

        if (protocol === "http:" || protocol === "https:")
        {
            shell.openExternal(e.url);
        }
    });

    console.log("serviceFreenodeAddEventListener ::: End");
}
