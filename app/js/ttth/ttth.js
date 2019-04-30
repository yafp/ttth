function updateDefaultView()
{
    var newDefaultView = $( "#selectDefaultView" ).val();
    console.log("updateDefaultView ::: NEw default view on start is set to: " + newDefaultView);

    $("#selectDefaultView").val(newDefaultView);

    // Store default view in local storage
    writeLocalStorage("defaultView", newDefaultView);
}



function loadDefaultView()
{
    console.log("loadDefaultView ::: Start");

    // read from local storage
    var curDefaultView = readLocalStorage("defaultView");

    console.warn("__" + curDefaultView);

    if(curDefaultView === null) // no default view configured
    {
        console.log("loadDefaultView ::: No default configured - Loading settings-view");
        loadSettings();

    }
    else
    {
        // check if the configured service is enabled or not - if not: load settings
        //
        var exists = false;
        for(var i = 0, opts = document.getElementById('selectDefaultView').options; i < opts.length; ++i)
        if( opts[i].value === 'bar' )
        {
            exists = true;
            break;
        }

        if(exists)
        {
            console.log("loadDefaultView ::: Loading the configured service");
            loadService(curDefaultView);
        }
        else
        {
            console.log("loadDefaultView ::: Fallback to default. Loading setting-view");
            loadSettings();
        }
    }

    console.log("loadDefaultView ::: End");

}


/**
* @name openURL
* @summary Opens a supllied url in default browser
* @description Opens a supllied url in default browser
* @param url - URL string which contains the target url
*/
function openURL(url)
{
    console.log("openURL ::: Start");

    const {shell} = require("electron");
    console.log("openURL ::: Trying to open the url: " + url);
    shell.openExternal(url);

    console.log("openURL ::: End");
}



function test()
{
    console.warn("TEST TEST TEST");

    const {remote} = require("electron"); //Imports the remote module to use session inside webview
    const { session } = require('electron');
    var ses = remote.session.defaultSession; //Gets the default session
    //ses.clearCache();
    ses.flushStorageData();
    ses.clearStorageData({ //Clears the specified storages in the session
        storages: ['appcache', 'serviceworkers', 'cachestorage', 'websql', 'indexdb'],
    });

    window.navigator.serviceWorker.getRegistrations().then(registrations => {
        for (let registration of registrations) {
            registration.unregister(); //Unregisters all the service workers
        }
    });
}


/**
* @name loadSettings
* @summary Opens the settings page
* @description Opens the settings page where app specific settings can be configured
*/
function loadSettings()
{
    console.log("loadPage ::: Start");
    $("#content").load("settings.html");

    console.log("loadPage ::: End");
}


/**
* @name loadService
* @summary Opens a supllied service
* @description Loads the supplied service to the content view
* @param pageName - Name of the service
*/
function loadService(pageName)
{
    console.log("loadPage ::: Start");
    console.log("loadPage ::: Loading: " + pageName);
    $("#content").load("services/" + pageName + ".html");

    console.log("loadPage ::: End");
}

/**
* @name toggleCheckbox
* @summary Triggered on click on a service checkbox on settings page
* @description Checks which service was clicked and hides or unihdes the related menu items. Writes to local stoage in addition
* @param objectName - Name of the checkbox
*/
function toggleCheckbox(objectName)
{
    console.log("toggleCheckbox ::: Start");

    console.log("toggleCheckbox ::: Checkbox is: " + objectName);

    if($('#'+objectName).prop('checked'))
    {
        console.log("toggleCheckbox ::: Activating " + objectName);
        writeLocalStorage(objectName, "true");
        $("#menu"+objectName).show();

        // add option to DefaultView select
        $("#selectDefaultView").append(new Option(objectName, objectName));
    }
    else
    {
        console.log("toggleCheckbox ::: Deactivating " + objectName);
        writeLocalStorage(objectName, "false");
        $("#menu"+objectName).hide();

        $("#selectDefaultView option[value='objectName']").remove();
    }

    console.log("toggleCheckbox ::: End");
}



/**
* @name readLocalStorage
* @summary Read from local storage
* @description
* @param key - Name of local storage key
* @return value - The value of the supplied key
*/
function readLocalStorage(key)
{
    console.log("readLocalStorage ::: Start");
    var value = localStorage.getItem(key);
    console.log("readLocalStorage ::: Reading key: " + key + " - found value: " + value);
    return(value);
}


/**
* @name writeLocalStorage
* @summary Write to local storage
* @description
* @param key - Name of local storage key
* @param value - New value
*/
function writeLocalStorage(key, value)
{
    console.log("writeLocalStorage ::: Start");
    console.log("writeLocalStorage ::: Writing key: " + key + " - with value: " + value);
    localStorage.setItem(key, value);
}


/**
* @name initMenu
* @summary Init the menu on app launch
* @description
*/
function initMenu()
{
    console.log("initMenu ::: Start");

    // WhatsApp
    //
    var whatsapp = readLocalStorage("whatsapp");
    if(whatsapp === "true")
    {
        console.log("initMenu ::: Activating WhatsApp");
        $("#menuwhatsapp").show();
        $('#whatsapp').prop('checked', true);
        $("#selectDefaultView").append(new Option("WhatsApp", "whatsapp"));
    }
    else
    {
        console.log("initMenu ::: Deactivating WhatsApp");
        $("#menuwhatsapp").hide();
        $('#whatsapp').prop('checked', false);
    }


    // calendar
    //
    var calendar = readLocalStorage("calendar");
    if(calendar === "true")
    {
        console.log("initMenu ::: Activating Calendar");
        $("#menucalendar").show();
        $('#calendar').prop('checked', true);
        $("#selectDefaultView").append(new Option("Google Calendar", "calendar"));
    }
    else
    {
        console.log("initMenu ::: Deactivating Calendar");
        $("#menucalendar").hide();
        $('#calendar').prop('checked', false);
    }

    // notes
    //
    var notes = readLocalStorage("notes");
    if(notes === "true")
    {
        console.log("initMenu ::: Activating Notes");
        $("#menunotes").show();
        $('#notes').prop('checked', true);
        $("#selectDefaultView").append(new Option("Google Keep", "notes"));
    }
    else
    {
        console.log("initMenu ::: Deactivating Notes");
        $("#menunotes").hide();
        $('#notes').prop('checked', false);
    }

    console.log("initMenu ::: End");
}



/**
* @name checkDisplaySize
* @summary Gets the display size and adjusts the window according to it
* @description Gets the display size and adjusts the window size to it. In addition the window gets centered (see main.js)
*/
function checkDisplaySize()
{
    console.log("checkDisplaySize ::: Start");

    // get current screen size
    var monitorWidth = screen.width;
    var monitorHeight = screen.height;
    console.log("checkDisplaySize ::: Detected screen size is: " + monitorWidth + "x" + monitorHeight);

    // set new window size
    var windowWidth = monitorWidth * 0.8;
    var windowHeight = monitorHeight * 0.8;


    // resize & center window
    //
    const {ipcRenderer} = require("electron");
    ipcRenderer.send("resize-me-please", windowWidth, windowHeight);

    console.log("checkDisplaySize ::: End");
}
