/**
* @name serviceGoogleKeepInit
* @summary Initializes the GoogleKeep Service
* @description Initializes the GoogleKeep Service
*/
function serviceGoogleKeepInit(serviceName, serviceUrl)
{
    console.log("serviceGoogleKeepInit ::: Start");

    // re-set the src for the webview
    //document.getElementById( serviceName + "Webview" ).setAttribute( "src", serviceUrl);
    document.getElementById( serviceName + "Webview" ).loadURL(serviceUrl);

    console.log("serviceGoogleKeepInit ::: End");
}
