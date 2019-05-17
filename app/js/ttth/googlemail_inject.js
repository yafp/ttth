// Get the ipcRenderer of electron
const {ipcRenderer} = require("electron");


// Do something according to a request of your mainview
ipcRenderer.on("request", function()
{
    ipcRenderer.sendToHost(getUnreadGoogleMailMessageCount());
});


function getUnreadGoogleMailMessageCount()
{
    console.log("getUnreadGoogleMailMessageCount ::: Start");

    var counter = document.querySelector(".aim .aio").querySelector("span").querySelector("a").getAttribute("aria-label").replace(/\D/g, "");

    console.log("getUnreadGoogleMailMessageCount ::: Total GoogleMail unread messages: " + counter);

    // send back from webview to main
    ipcRenderer.sendToHost(counter);

    //return counter;
}
