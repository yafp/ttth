// inyector.js

// source
// https://ourcodeworld.com/articles/read/201/how-to-send-retrieve-information-and-manipulate-the-dom-from-a-webview-with-electron-framework


// Get the ipcRenderer of electron
const {ipcRenderer} = require("electron");



// Do something according to a request of your mainview
//
ipcRenderer.on("request", function()
{
    console.log("request ::: Start");
    ipcRenderer.sendToHost(getUnreadTelegramMessageCount());
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
 * Simple function to return the source path of all the scripts in the document
 * of the <webview>
 *
 *@returns {String}
 **/
function getUnreadTelegramMessageCount()
{
    console.log("getUnreadTelegramMessageCount ::: Start");

    // try to count unread messages
    //
    //

    // V1: using: querySelectorAll
    //
    //
    //var list = document.querySelectorAll("im_dialog_badge.badge"); // no space - dots
    //console.log(list)
    //console.log(list.length);


    // V2: using: getElementsByClassName
    //
    //var e=document.getElementsByClassName("im_dialog_badge badge"),t=0; // space
    //var e = document.getElementsByClassName("im_dialog_badge badge"); // space
    //console.error(e);
    //console.log(e.length);


    // V3:
    //
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

        return counter;
    }
}
