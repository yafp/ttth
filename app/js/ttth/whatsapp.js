/**
* @name whatsappStart
* @summary Adds several event listener to WhatsApp WebView
* @description Adds several event listener to WhatsApp WebView
*/
function whatsappStart()
{
    console.log("whatsappStart ::: Start");

    // get webview
    var webview = document.getElementById("WhatsAppWebview");


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
    }, 15000);


    // WebView Event: did-start-loading
    //
    webview.addEventListener("did-start-loading", function()
    {
        console.log("whatsappStart ::: did-start-loading.");
    });


    // WebView Event: dom-ready
    //
    webview.addEventListener("dom-ready", function()
    {
        console.log("whatsappStart ::: DOM-Ready");
    });


    // WebView Event: did-frame-finish-load
    //
    webview.addEventListener("did-frame-finish-load", function()
    {
        console.log("whatsappStart ::: did-frame-finish-load.");
    });


    // WebView Event: did-stop-loading
    //
    webview.addEventListener("did-stop-loading", function()
    {
        console.log("whatsappStart ::: did-stop-loading");

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
        console.log("whatsappStart ::: IPC message:");
        //console.log(event);
        //console.error(event.channel);

        // update the badge
        updateWhatsAppBadge(event.channel);
    });


    console.log("whatsappStart ::: End");
}


/**
* @name whatsappRegister
* @summary Register WhatsApp Web sessions
* @description Flushes the storage data, clears the storage data -> helps running WhatsApp-Web
*/
function whatsappRegister()
{
    console.log("whatsappRegister ::: Start");
    console.log("whatsappRegister ::: Trying to fix WhatsApp-Web connectivity issues");

    const {remote} = require("electron"); //Imports the remote module to use session inside webview
    const { session } = require("electron");
    var ses = remote.session.defaultSession; //Gets the default session
    //ses.clearCache();
    ses.flushStorageData();
    ses.clearStorageData({ //Clears the specified storages in the session
        storages: ["appcache", "serviceworkers", "cachestorage", "websql", "indexdb"],
    });

    window.navigator.serviceWorker.getRegistrations().then(registrations => {
        for (let registration of registrations)
        {
            registration.unregister(); //Unregisters all the service workers
        }
    });

    // via: https://github.com/meetfranz/franz/issues/1185

    console.log("whatsappRegister ::: End");
}




/**
* @name updateWhatsAppBadge
* @summary Updates the unread message badge of WhatsApp
* @description Updates the unread message badge of WhatsApp
*/
function updateWhatsAppBadge(count)
{
    console.log("updateWhatsAppBadge ::: Start");

    var unreadMessages = count;
    if(unreadMessages === 0)
    {
        unreadMessages = "";
    }

    // might be null - should be ignored
    if(unreadMessages === null)
    {
        return;
    }

    console.log("updateWhatsAppBadge ::: New count is: " + unreadMessages);

    // update UI
    $( "#badge_whatsapp" ).html( unreadMessages );



    // change tray icon if count > 0
    //
    if(unreadMessages > 0)
    {
        console.log("updateWhatsAppBadge ::: Tray icon should now show that there is something to read");

        const {ipcRenderer} = require('electron');
        ipcRenderer.send('changeTrayIconToUnreadMessages');
    }
    else
    {
        console.log("updateWhatsAppBadge ::: Tray icon should use the default icon now");

        const {ipcRenderer} = require('electron');
        ipcRenderer.send('changeTrayIconToDefault');
    }


    console.log("updateWhatsAppBadge ::: End");
}









// via: https://github.com/ramboxapp/community-edition/issues/1446
/*
function checkUnread()
{
    console.log("checkUnread ::: Start");

	const elements = document.querySelectorAll(".CxUIE, .unread");
    console.error(elements);
	let count = 0;

	for (let i = 0; i < elements.length; i++)
    {
		if (elements[i].querySelectorAll('*[data-icon="muted"]').length === 0)
        {
			count += 1;
            console.log("checkUnread ::: Found unread message");
		}
	}


    // run code in loop
    //setTimeout("checkUnread()", 10000);

    console.log("checkUnread ::: End");
}
*/
