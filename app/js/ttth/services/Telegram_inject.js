const {ipcRenderer} = require("electron");


/**
* @name serviceTelegramGetUnreadMessageCount
* @summary Gets the amount of unread messages of the service Telegram
* @description Gets the amount of unread messages of the service Telegram
*/
function serviceTelegramGetUnreadMessageCount()
{
    console.log("serviceTelegramGetUnreadMessageCount ::: Checking unread message count");

    var count = 0;
    var intervalID = window.setInterval(myCallback, 50);
    function myCallback()
    {
        var eventToClick = document.getElementsByClassName("im_dialog_badge badge");
        if (eventToClick.length > 0)
        {
            //console.log(eventToClick);
            for (var i = 0; i < eventToClick.length; i++)
            {
                //console.log(eventToClick[i]);

                // Check if we count this element or not
                if(!eventToClick[i].classList.contains("ng-hide")) // Count it
                {
                    count = count +1;
                    console.log("serviceTelegramGetUnreadMessageCount ::: Found communication with unread messages. Current sum is: _" + count + "_.");
                }
            }
            clearInterval(intervalID);
        }

        console.log("serviceTelegramGetUnreadMessageCount ::: Total Telegram chats with unread messages: _" + count + "_." );

        // send back from webview to main
        ipcRenderer.sendToHost(count.toString());
        return count;
    }
}


ipcRenderer.on("request", function()
{
    ipcRenderer.sendToHost(serviceTelegramGetUnreadMessageCount());
});
