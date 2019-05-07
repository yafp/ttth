var ttthAvailableServices = new Array(
    "GitHub",
    "GoogleCalendar",
    "GoogleContacts",
    "GoogleKeep",
    "GoogleMail",
    "WhatsApp",
    "Telegram",
    "Threema"
);



function updateLogo()
{
    console.warn("UPDATE_LOGO");
    $('#target_whatsapp').html("UPDATED LOGO / DESC");
}



function foo()
{
    console.error("fooooooooo");

    process.once('document-start', () => {
        console.log('this is the document start event');
    })
}



/**
* @name sendNotification
* @summary Send a notification
* @description Creates a desktop notification
* @param title- Title string for the notification
* @return message - Message string for the notification
*/
function sendNotification(title, message)
{
    let myNotification = new Notification(title, {
        body: message,
        icon: '../assets/icons/png/16x16.png'
    });

    /*
    myNotification.onclick = () => {
        console.log('Notification clicked')
    }
    */
}




/**
* @name readLocalStorage
* @summary Read from local storage
* @description Reads a value stored in local storage (for a given key)
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
* @description Writes a value for a given key to local storage
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
* @name resetDefaultView
* @summary Reset the stored default view
* @description Deletes the localstorage key 'defaultview'
*/
function resetDefaultView()
{
    console.log("resetDefaultView ::: Start");

    // delete local storage key and its related value
    localStorage.removeItem("defaultView");

    // reset the selection of the select item
    $("#selectDefaultView").prop("selectedIndex",0);

    // send notification
    sendNotification("Updated Settings", "Default view on startup is now set back to defaults (Settings).");

    console.log("resetDefaultView ::: Start");
}


/**
* @name checkSupportedOperatingSystem
* @summary Checks if the operating system is supported or not
* @description Checks if the operating system is linux. Everything else is untested so far.
*/
function checkSupportedOperatingSystem()
{
    console.log("checkSupportedOperatingSystem ::: Start");

    var userPlatform = process.platform;
    console.log("checkSupportedOperatingSystem ::: Detected operating system as: " + userPlatform);

    if(userPlatform === "linux")
    {
        console.log("checkSupportedOperatingSystem ::: Operating system " + userPlatform + " is fine." );
    }
    else
    {
        // set error message
        $( ".errorText" ).append( "<p>" + userPlatform + " is currently not supported.</p>" );

        // show  error dialog
        $("#myModal").modal("show");

        console.error("checkSupportedOperatingSystem ::: Operating system " + userPlatform + " is currently not supported." );
    }

    console.log("checkSupportedOperatingSystem ::: End");
}


/**
* @name switchToService
* @summary Opens a supllied service
* @description Loads the supplied service to the content view
* @param pageName - Name of the service
*/
function switchToService(pageName)
{
    console.log("switchToService ::: Start");
    console.log("switchToService ::: Loading: " + pageName.toLowerCase());

    // activate the related tab
    $("#target_"+pageName.toLowerCase()).trigger("click");

    console.log("switchToService ::: End");
}


/**
* @name checkForNewRelease
* @summary Checks if there is a new release available
* @description Compares the local app version number with the tag of the latest github release. Displays a notification in the settings window if an update is available.
*/
function checkForNewRelease()
{
    console.log("checkForNewRelease ::: Start");

    var remoteAppVersionLatest = "0.0.0";

    var gitHubPath = "yafp/ttth";  // user/repo
    var url = "https://api.github.com/repos/" + gitHubPath + "/tags";

    $.get(url).done(function (data)
    {
        var versions = data.sort(function (v1, v2)
        {
            return semver.compare(v2.name, v1.name);
        });

        // get the current latest public release version number
        //
        // TODO / FIXME
        //var remoteAppVersionLatest = versions[0].name;

        // get local version
        var localAppVersion = require("electron").remote.app.getVersion();

        console.log("checkForNewRelease ::: Local version: " + localAppVersion);
        console.log("checkForNewRelease ::: Latest public version: " +remoteAppVersionLatest);

        if(localAppVersion < remoteAppVersionLatest)
        {
            console.log("checkForNewRelease ::: Found update, notify user");

            // update the updater-info text
            $("#updateInformation").html('ttth ' + remoteAppVersionLatest + ' is now available. See <a href="#" onClick=\'openURL("https://github.com/yafp/ttth/blob/master/CHANGELOG.md")\'>Changelog</a> for details. Download is available <a href="#" onClick=\'openURL("https://github.com/yafp/ttth/releases")\'>here</a>.');

            // show update information
            $("#updateInformation").show();

            // send notification
            sendNotification("Update available", "Version " + remoteAppVersionLatest + " is now available.");
        }
        else
        {
            console.log("checkForNewRelease ::: No newer version found.");

            // hide update information
            $("#updateInformation").hide();

        }
    });

    console.log("checkForNewRelease ::: End");
}


/**
* @name updateDefaultView
* @summary Stores a new default view to local storage
* @description Users can define a default / startup view in settings. This method stores the users choice into local storage.
*/
function updateDefaultView()
{
    console.log("updateDefaultView ::: Start");

    // get currently selected value from select
    var newDefaultView = $( "#selectDefaultView" ).val();
    console.log("updateDefaultView ::: New default view on start is set to: " + newDefaultView);

    // Store new default view in local storage
    writeLocalStorage("defaultView", newDefaultView);

    // send notification
    sendNotification("Updated Settings", "Default view is now configured to load " + newDefaultView + " on startup.");

    console.log("updateDefaultView ::: End");
}


/**
* @name validateConfiguredDefaultView
* @summary Checks on startup if the service configured as default view is a valid / enabled service
* @description Checks if the default view is valid, otherwise fallbacks to settings view
*/
function validateConfiguredDefaultView()
{
  // read from local storage
  var curDefaultView = readLocalStorage("defaultView");

  if(curDefaultView === null) // no default view configured
  {
      console.log("validateConfiguredDefaultView ::: No default configured - Stay on settings-view");
  }
  else
  {
    console.log("validateConfiguredDefaultView ::: Found configured default view: " + curDefaultView);

    // check if the configured service is enabled or not
    console.log("validateConfiguredDefaultView ::: Check if configured default view is an enabled service or not");

    var exists = false;

    // Check if Dropdown contains the defined default view as enabled service
    $("#selectDefaultView option").each(function(){
        if (this.value === curDefaultView)
        {
            exists = true;
            return false;
        }
    });

    if(exists)
    {
        console.log("validateConfiguredDefaultView ::: Configured default view is valid");

        // Update select
        $("#selectDefaultView").val(curDefaultView);
    }
    else
    {
        console.log("validateConfiguredDefaultView ::: Fallback to default (setting-view)");

        // reset the selection of the select item
        $("#selectDefaultView").prop("selectedIndex",0);

        // delete the localstorage entry for defaultview
        resetDefaultView();
    }
  }
}


/**
* @name loadDefaultView
* @summary Loads the default view
* @description Loads the default view
*/
function loadDefaultView()
{
    console.log("loadDefaultView ::: Start");

    // read from local storage
    var curDefaultView = readLocalStorage("defaultView");

    if(curDefaultView === null) // no default view configured
    {
        console.log("loadDefaultView ::: No default configured");
    }
    else
    {
        console.log("loadDefaultView ::: Found configured default view: " + curDefaultView);
        switchToService(curDefaultView);
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


/**
* @name toggleCheckbox
* @summary Triggered on click on a service checkbox on settings page
* @description Checks which service was clicked and hides or unihdes the related menu items. Writes to local stoage in addition
* @param objectName - Name of the checkbox
*/
function toggleCheckbox(objectName)
{
    console.log("toggleCheckbox ::: Start");

    //console.log("toggleCheckbox ::: Checkbox is: " + objectName);

    if($("#"+objectName).prop("checked"))
    {
        console.log("toggleCheckbox ::: Activating " + objectName);

        // write to local storage
        writeLocalStorage(objectName, "true");

        // show service in menu
        $("#menu_"+objectName.toLowerCase()).show();

        // add option to DefaultView select
        $("#selectDefaultView").append(new Option(objectName, objectName));

        // update status button
        $("#bt_" + objectName).attr('class', 'btn btn-success btn-sm');

        // send notification
        sendNotification("Service activated", "Activated the service "+objectName)
    }
    else
    {
        console.log("toggleCheckbox ::: Deactivating " + objectName);

        // write to local storage
        writeLocalStorage(objectName, "false");

        // hide service from menu
        $("#menu_"+objectName.toLowerCase()).hide();

        // update select
        $("#selectDefaultView option").each(function()
        {
          if (this.value === objectName)
          {
            console.log("toggleCheckbox ::: Deleting item from select");
            this.remove();
          }
        });

        // update status button
        $("#bt_" + objectName).attr('class', 'btn btn-danger btn-sm');
    }

    validateConfiguredDefaultView();

    console.log("toggleCheckbox ::: End");
}


/**
* @name initSettingsPage
* @summary Initializes the settings page
* @description Shows appname, version, links to github informations. update informations. Initializes the service-checkboxes on loading the view
*/
function initSettingsPage()
{
    console.log("initSettingsPage ::: Start");

    console.log("initSettingsPage ::: Show appname and version");

    // get appname and version
    var appVersion = require("electron").remote.app.getVersion();
    var appName = require("electron").remote.app.getName();

    // show appname and version
    $( "#settingsAppName" ).html( appName );
    $( "#settingsAppVersion" ).html( appVersion );

    console.log("initSettingsPage ::: Show enabled services in settings interface");

    // loop over array ttthAvailableServices
    //
    var arrayLength = ttthAvailableServices.length;
    for (var i = 0; i < arrayLength; i++)
    {
        console.log("initMenu ::: Checking status of service: " + ttthAvailableServices[i]);

        // Add service to settings page
        // formerley hardcoded in index.html
        //
        //$( "#settingsAvailableServices" ).append("<p>" + ttthAvailableServices[i] + "</p>");

        /*
        $( "#settingsAvailableServices" ).append('<div class="input-group input-group-sm mb-1"><div class="input-group-prepend"><div class="input-group-text">');
        $( "#settingsAvailableServices" ).append('<input type="checkbox" id=' + ttthAvailableServices[i] + ' name=' + ttthAvailableServices[i] + ' onClick="toggleCheckbox(' + ttthAvailableServices[i] + ');">');
        $( "#settingsAvailableServices" ).append('</div></div>'');
        $( "#settingsAvailableServices" ).append('<input type="text" class="form-control" aria-label="Text input with checkbox" value='+ ttthAvailableServices[i] +'  disabled>');
        $( "#settingsAvailableServices" ).append('<div class="input-group-prepend">');
        $( "#settingsAvailableServices" ).append('<button type="button" class="btn btn-danger btn-sm" id="bt_'+ttthAvailableServices[i] +'" disabled></button></div></div>');
        */





        var curServiceStatus = readLocalStorage(ttthAvailableServices[i]);
        if(curServiceStatus === "true")
        {
            // check the checkbox
            $("#"+ttthAvailableServices[i]).prop("checked", true);

            // add to defaultView select item
            $("#selectDefaultView").append(new Option(ttthAvailableServices[i], ttthAvailableServices[i]));

            // update class of status button
            $("#bt_"+ttthAvailableServices[i]).attr('class', 'btn btn-success btn-sm');
        }
    }

    // Change defaultView select item to select2 item
    //$('#selectDefaultView').select2();

    // now validate the optional configured default view
    validateConfiguredDefaultView();

    console.log("initSettingsPage ::: End");
}



/**
* @name initMenu
* @summary Init the menu / navigation on app launch
* @description Checks which services are enabled and adds or removes them from navigation
*/
function initMenu()
{
    console.log("initMenu ::: Start");

    // loop over array ttthAvailableServices
    var arrayLength = ttthAvailableServices.length;
    for (var i = 0; i < arrayLength; i++)
    {
        console.log("initMenu ::: Checking status of service: " + ttthAvailableServices[i]);

        var curServiceStatus = readLocalStorage(ttthAvailableServices[i]);

        if(curServiceStatus === "true")
        {
            console.log("initMenu ::: Activating " + ttthAvailableServices[i] );

            // show service in menu
            $("#menu_" + ttthAvailableServices[i].toLowerCase()).show();
        }
        else
        {
            console.log("initMenu ::: Deactivating " + ttthAvailableServices[i]);

            // hide service from menu
            $("#menu_" + ttthAvailableServices[i].toLowerCase()).hide();
        }
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
