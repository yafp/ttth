/**
* @name serviceGooglePhotosInit
* @summary Initializes the GooglePhotos Service
* @description Initializes the GooglePhotos Service
*/
function serviceGooglePhotosInit(serviceName, serviceUrl)
{
    console.log("serviceGooglePhotosInit ::: Start");

    // re-set the src for the webview
    //document.getElementById( serviceName + "Webview" ).setAttribute( "src", serviceUrl);
    document.getElementById( serviceName + "Webview" ).loadURL(serviceUrl);

    console.log("serviceGooglePhotosInit ::: End");
}
