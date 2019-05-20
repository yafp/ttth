// Get the ipcRenderer of electron
const {ipcRenderer} = require("electron");


// Do something according to a request of your mainview
ipcRenderer.on("request", function()
{
    ipcRenderer.sendToHost(getUnreadGoogleMessagesCount());
});


function getUnreadGoogleMessagesCount()
{
    console.log("getUnreadGoogleMessagesCount ::: Start");

    var counter = document.querySelectorAll(".tpEAA.yrs5ff").length;if(t>=1){rambox.setUnreadCount(t)

    console.log("getUnreadGoogleMessagesCount ::: Total GoogleMessages unread messages: " + counter);

    // send back from webview to main
    ipcRenderer.sendToHost(counter);

    //return counter;
}
