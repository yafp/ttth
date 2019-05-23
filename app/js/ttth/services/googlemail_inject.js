// Get the ipcRenderer of electron
const {ipcRenderer} = require("electron");


/**
* @name serviceGoogleMailGetUnreadMessageCount
* @summary Gets the amount of unread messages of the service GoogleMail
* @description Gets the amount of unread messages of the service GoogleMail
*/
function serviceGoogleMailGetUnreadMessageCount()
{
    console.log("serviceGoogleMailGetUnreadMessageCount ::: Start");

    var counter = document.querySelector(".aim .aio").querySelector("span").querySelector("a").getAttribute("aria-label").replace(/\D/g, "");

    console.log("serviceGoogleMailGetUnreadMessageCount ::: Total GoogleMail unread messages: " + counter);

    // send back from webview to main
    ipcRenderer.sendToHost(counter);
}


// Do something according to a request of your mainview
ipcRenderer.on("request", function()
{
    ipcRenderer.sendToHost(serviceGoogleMailGetUnreadMessageCount());
});
