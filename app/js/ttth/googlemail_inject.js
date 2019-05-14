// Get the ipcRenderer of electron
const {ipcRenderer} = require("electron");


// Do something according to a request of your mainview
ipcRenderer.on("request", function()
{
    console.log("request ::: Start");
    ipcRenderer.sendToHost(getUnreadGoogleMailMessageCount());
    console.log("request ::: End");
});


ipcRenderer.on("alert-something",function(event,data)
{
    alert(data);
});


ipcRenderer.on("change-text-element",function(event,data)
{
    // the document references to the document of the <webview>
    document.getElementById(data.id).innerHTML = data.text;
});


/**
 **/
function getUnreadGoogleMailMessageCount()
{
    console.log("getUnreadGoogleMailMessageCount ::: Start");

    
    var counter = document.querySelector(".aim .aio").querySelector("span").querySelector("a").getAttribute("aria-label").replace(/\D/g, "");
    
    console.log("getUnreadGoogleMailMessageCount ::: Total GoogleMail unread messages: " + counter);

    // send back from webview to main
    ipcRenderer.sendToHost(counter);

    return counter;

}
