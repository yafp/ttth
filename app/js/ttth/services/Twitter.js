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
