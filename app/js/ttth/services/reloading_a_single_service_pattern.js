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
