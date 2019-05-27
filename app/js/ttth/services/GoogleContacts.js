/**
* @name serviceGoogleContactsInit
* @summary Initializes the GoogleConstats Service
* @description Initializes the GoogleContacts Service
*/
function serviceGoogleContactsInit(serviceName, serviceUrl)
{
    console.log("serviceGoogleContactsInit ::: Start");

    // re-set the src for the webview
    //document.getElementById( serviceName + "Webview" ).setAttribute( "src", serviceUrl);
    document.getElementById( serviceName + "Webview" ).loadURL(serviceUrl);

    console.log("serviceGoogleContactsInit ::: End");
}
