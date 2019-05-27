/**
* @name serviceGitHubInit
* @summary Initializes the GitHub Service
* @description Initializes the GitHub Service
*/
function serviceGitHubInit(serviceName, serviceUrl)
{
    console.log("serviceGitHubInit ::: Start");

    // re-set the src for the webview
    //document.getElementById( serviceName + "Webview" ).setAttribute( "src", serviceUrl);
    document.getElementById( serviceName + "Webview" ).loadURL(serviceUrl);

    console.log("serviceGitHubInit ::: End");
}
