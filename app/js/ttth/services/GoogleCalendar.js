/**
* @name serviceGoogleCalendarInit
* @summary Initializes the GoogleCalendar Service
* @description Initializes the GoogleCalendar Service
*/
function serviceGoogleCalendarInit(serviceName, serviceUrl)
{
    console.log("serviceGoogleCalendarInit ::: Start");

    // re-set the src for the webview
    //document.getElementById( serviceName + "Webview" ).setAttribute( "src", serviceUrl);
    document.getElementById( serviceName + "Webview" ).loadURL(serviceUrl);

    console.log("serviceGoogleCalendarInit ::: End");
}
