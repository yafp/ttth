// Get the ipcRenderer of electron
const {ipcRenderer} = require("electron");

function getUnreadTelegramMessageCount()
{
    console.log("getUnreadTelegramMessageCount ::: Start");

    var counter = 0;
    var intervalID = window.setInterval(myCallback, 50);
    function myCallback()
    {
        var eventToClick = document.getElementsByClassName("im_dialog_badge badge");
        if (eventToClick.length > 0)
        {
            console.log(eventToClick);
            for (var i = 0; i < eventToClick.length; i++)
            {
                console.log(eventToClick[i]);

                // Check if we count this element or not
                if(!eventToClick[i].classList.contains("ng-hide")) // Count it
                {
                    console.log("getUnreadTelegramMessageCount ::: Found communication with unread messages. +1");
                    counter = counter +1;
                }
            }
            clearInterval(intervalID);
        }

        console.log("getUnreadTelegramMessageCount ::: Total Telegram chats with unread messages: " + counter);

        // send back from webview to main
        ipcRenderer.sendToHost(counter);
    }
}



// Do something according to a request of your mainview
//
ipcRenderer.on("request", function()
{
    ipcRenderer.sendToHost(getUnreadTelegramMessageCount());
});
