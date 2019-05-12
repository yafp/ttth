function telegramStart()
{
    console.log("telegramStart ::: Start");

    // get webview
    var webview = document.getElementById("TelegramWebview");


    // communication between main & webview:
    // https://ourcodeworld.com/articles/read/201/how-to-send-retrieve-information-and-manipulate-the-dom-from-a-webview-with-electron-framework


    // WebView Events: https://electronjs.org/docs/api/webview-tag#dom-events
    //
    //


    // run it periodically
    //
    //  5.000 =  5 sec
    // 15.000 = 15 sec
    //
    var intervalID = setInterval(function()
    {
        webview.send("request");
    }, 30000);


    // WebView Event: did-start-loading
    //
    webview.addEventListener("did-start-loading", function()
    {
        console.log("telegramStart ::: did-start-loading.");

         webview.send("request");
    });


    // WebView Event: dom-ready
    //
    webview.addEventListener("dom-ready", function()
    {
        console.log("telegramStart ::: DOM-Ready");

         webview.send("request");
    });


    // WebView Event: did-frame-finish-load
    //
    webview.addEventListener("did-frame-finish-load", function()
    {
        console.log("telegramStart ::: did-frame-finish-load.");
    });


    // WebView Event: did-stop-loading
    //
    webview.addEventListener("did-stop-loading", function()
    {
        console.log("telegramStart ::: did-stop-loading");

        // Show devTools if you want
        //
        //webview.openDevTools();

        // Triggering search for unread messages
        webview.send("request");

        // alert-something
        //webview.send("alert-something", "Hey, i'm alerting this.");
    });


    // WebView Event:  ipc-message
    webview.addEventListener('ipc-message',function(event)
    {
        console.log("telegramStart ::: IPC message:");
        //console.log(event);
        //console.info(event.channel);

        // update the badge
        updateTelegramBadge(event.channel);
    });


    console.log("telegramStart ::: End");
}





function updateTelegramBadge(count)
{
    console.log("updateTelegramBadge ::: Start");

    var unreadMessages = count;
    if(unreadMessages === 0)
    {
        unreadMessages = "";
    }

    // update UI
    $( "#badge_telegram" ).html( unreadMessages );

    // change tray icon if count > 0
    //
    /*
    if(unreadMessages > 0)
    {
        console.log("updateTelegramBadge ::: Tray icon should now show that there is something to read");

        const {ipcRenderer} = require('electron');
        ipcRenderer.send('changeTrayIconToUnreadMessages');
    }
    else
    {
        console.log("updateTelegramBadge ::: Tray icon should use the default icon now");

        const {ipcRenderer} = require('electron');
        ipcRenderer.send('changeTrayIconToDefault');
    }
    */


    updateTrayIconStatus();


    console.log("updateTelegramBadge ::: End");
}




/*
function checkUnreadTelegramMessageCount()
{
    console.log("checkUnreadTelegramMessageCount ::: Start");

    var e=document.getElementsByClassName("im_dialog_badge badge"),t=0;
    for(i=0;i<e.length;i++)
    if(!e[i].classList.contains("im_dialog_badge_muted"))
    {
        t+=parseInt(e[i].innerHTML.trim())
    }

    console.log("checkUnreadTelegramMessageCount ::: End");
}
*/
