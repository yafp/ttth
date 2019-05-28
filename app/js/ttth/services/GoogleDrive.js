/**
* @name serviceGoogleDriveInit
* @summary Initializes the GoogleDrive Service
* @description Initializes the GoogleDrive Service
*/
function serviceGoogleDriveInit(serviceName, serviceUrl)
{
    console.log("serviceGoogleDriveInit ::: Start");

    // re-set the src for the webview
    //document.getElementById( serviceName + "Webview" ).setAttribute( "src", serviceUrl);
    document.getElementById( serviceName + "Webview" ).loadURL(serviceUrl);

    console.log("serviceGoogleDriveInit ::: End");
}
