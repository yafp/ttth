function whatsUp()
{
    console.error("whatsUp ::: Start");
    
    // get ref to Whatsapp webview
    var myWebview = document.getElementById('WhatsAppWebview');
    //console.warn(myWebview);


    // Events:
    //
    // see: https://electronjs.org/docs/api/webview-tag


    


    // Search 
    //
    myWebview.addEventListener('found-in-page', (e) => {
        myWebview.stopFindInPage('keepSelection')
        console.warn("EventListener: found-in-page");

    });



    // did-start-loading
    // 
    myWebview.addEventListener("did-start-loading", function (e) 
    {
        console.warn("EventListener: did-start-loading");
        //myWebview.openDevTools();
    });


    // did-stop-loading
    //
    myWebview.addEventListener("did-stop-loading", function (e) 
    {
        console.warn("EventListener: did-stop-loading");
        myWebview.openDevTools();
        checkUnread();
    });


    // dom-ready
    //
    myWebview.addEventListener("dom-ready", function (e) 
    {
        console.warn("EventListener: dom-ready");
        //myWebview.openDevTools();


        // Start a search
        //
        console.log("---------------------------------------");
        console.log("Searching for Droll: ...")
        const requestId = myWebview.findInPage('Droll')
        console.log("Request: " + requestId)
        console.log("---------------------------------------");


        // Try executing code
        //
        //myWebview.executeJavaScript(checkUnread(), false);
    
    });



    // IPC
    //
    myWebview.addEventListener('ipc-message', (event) => {
        console.log("---------------------------------------");
        console.log("IPC:")
        console.log(event.channel)
        console.log("---------------------------------------");
        // Prints "pong"
    });




    // Execute javascript
    //
    //console.error("---------------------------------------");
    //myWebview.executeJavaScript("alert('ole')", false);
    //myWebview.executeJavaScript(checkUnread(), false);
    //console.error("---------------------------------------");


    console.error("whatsUp ::: End");
}







/**
* @name register
* @summary Register WhatsApp Web sessions
* @description Flushes the storage data, clears the storage data -> helps running WhatsApp-Web
*/
function register()
{
    console.log("register ::: Start");
    console.log("register ::: Trying to fix WhatsApp-Web connectivity issues");

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

    console.log("register ::: End");
}









// via: https://github.com/ramboxapp/community-edition/issues/1446
function checkUnread()
{
    console.log("checkUnread ::: Start");


    // test
    //
    /*
    let el = document.querySelector('#WhatsAppWebview');
    console.log(el)
    let matches = el.querySelectorAll(".CxUIE, .unread");
    console.log(matches)
    */





    // default
	const elements = document.querySelectorAll(".CxUIE, .unread");
    console.error(elements);
	let count = 0;

    console.log("checkUnread ::: Progress 1");

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





// via: https://github.com/ramboxapp/community-edition/issues/1446
function updateBadge(count)
{
	if (count && count >= 1)
    {
		//rambox.setUnreadCount(count);
	}
    else
    {
		//rambox.clearUnreadCount();
	}
}

















function checkForUnreadWhatsAppMessages()
{
    window.setInterval(function()
    {
        // for testing 
        updateWhatsAppBadge();

        // the way to go
        checkUnread();
    }, 5000);
}



function updateWhatsAppBadge()
{
     console.log("updateWhatsAppBadge ::: End"); 

    // for test issues we are generating a random number here
    //var unreadMessages = Math.random();
    var unreadMessages = Math.floor(Math.random() * 9) + 1 

    $( "#badge_whatsapp" ).html( unreadMessages );
}
