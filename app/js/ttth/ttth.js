/**
* @name closeSingleServiceConfiguratationWindow
* @summary Triggers a function in main.js to close the single-service-configuration popup window
* @description Triggers a function in main.js to close the single-service-configuration popup window
*/
function closeSingleServiceConfiguratationWindow()
{
    const {ipcRenderer} = require("electron");
    ipcRenderer.send("closeConfigureSingleServiceWindow");
}


// Storing the data from secondWindow
/**
* @name updateSingleServiceConfiguration
* @summary Fetches the input values from the single-service-configuration popup window and updates the related service config
* @description Fetches the input values from the single-service-configuration popup window and updates the related service config
*/
function updateSingleServiceConfiguration()
{
    const storage = require('electron-json-storage');

    // get values from secondWindow
    var serviceId = $("#input_serviceId").val();
    var serviceType = $("#input_serviceType").val(); // hidden
    var serviceName = $("#input_serviceName").val();
    var serviceIcon = $("#input_serviceIcon").val();
    var serviceUrl = $("#input_serviceUrl").val();
    var serviceInjectCode = $("#input_serviceInjectCode").val(); //hidden
    var serviceEnableStatus = $("#input_serviceEnableStatus").val(); //hidden
    if (serviceEnableStatus === "true")
    {
        serviceEnableStatus = true;
    }
    else {
        serviceEnableStatus = false;
    }

    // update the config of the configured service (status)
    storage.set(serviceId, {
        "type": serviceType,
        "name": serviceName,
        "icon": serviceIcon,
        "url": serviceUrl,
        "injectCode": serviceInjectCode,
        serviceEnableStatus: serviceEnableStatus
    }, function(error)
    {
        if (error) throw error;
    });

    console.log("updateSingleServiceConfiguration ::: Updating service config: _" + serviceId + "_.");

    closeSingleServiceConfiguratationWindow();
}


/**
* @name configureSingleUserService
* @summary Triggers a function in main.js to  open the single-service-configuration popup window
* @description Triggers a function in main.js to  open the single-service-configuration popup window
* @param serviceId - id of the service
*/
function configureSingleUserService(serviceId)
{
    console.log("configureSingleUserService ::: Trying to open service configure window for service: _" + serviceId + "_.");

    // send ipc to show second window
    const {ipcRenderer} = require("electron");
    ipcRenderer.send("showConfigureSingleServiceWindow", serviceId);
}


/**
* @name showNoty
* @summary Shows a noty notification
* @description Creates a notification using the noty framework
* @param type - Options: alert, success, warning, error, info/information
* @param message - notification text
*/
function showNoty(type, message, timeout = 3000)
{
    new Noty({
        type: type,
        timeout: timeout,
        theme: "bootstrap-v4",
        layout: "bottom",
        text: message,
    }).show();
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
    var value = localStorage.getItem(key);
    console.log("readLocalStorage ::: key: _" + key + "_ - got value: _" + value +"_");
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
    console.log("writeLocalStorage ::: key: _" + key + "_ - new value: _" + value + "_");
    localStorage.setItem(key, value);
}


/**
* @name updateWindowTitle
* @summary Triggers an update title function in main.js
* @description Triggers an update title function in main.js. This is needed to update the app window title to display the current / frontmost service.
* @param TabName - Name of the current tab
*/
function updateWindowTitle(tabName)
{
    console.log("updateWindowTitle ::: Sending _" + tabName + "_ to main.js");

    const {ipcRenderer} = require("electron");
    ipcRenderer.send("updateWindowTitle", tabName);
}


/**
* @name isMac
* @summary Checks if the operating system type is mac/darwin or not
* @description Checks if the operating system type is mac/darwin or not
* @return value - Boolean: True if mac, false if not
*/
function isMac()
{
    var os = require("os");

    // os types:
    //
    // - Darwin
    // - Linux
    // - Windows_NT
    console.log("isMac ::: Detected operating system type is: " + os.type());
    if(os.type() === "Darwin")
    {
        return true;
    }
    else
    {
        return false;
    }
}


/**
* @name settingUserColorUpdate
* @summary Updates the default color
* @description Updates the default color
*/
function settingUserColorUpdate()
{
    // get value from select
    var newUserColor = $( "#selectUserColor" ).val();
    console.log("settingUserColorUpdate ::: New CSS style is set to: " + newUserColor);

    writeLocalStorage("settingUserColorName", newUserColor);

    // reload page
    location.reload();
}


/**
* @name settingUserColorReset
* @summary Resets back to default color
* @description Resets back to default color
*/
function settingUserColorReset()
{
    writeLocalStorage("settingUserColorName", "default.css");

    console.log("settingUserColorReset ::: Resetting user color style back to default");

    $("#selectUserColor").val("default.css");

    // reload page
    location.reload();
}


/**
* @name settingToggleUserColor
* @summary Executed when user color checkbox in settings gets clicked
* @description Executed when user color checkbox in settings gets clicked
*/
function settingToggleUserColor()
{
    if($("#checkboxSettingUserColor").prop("checked"))
    {
        console.log("settingToggleUserColor ::: User color style is enabled");

        // user has enabled a custom user color
        var userColor = $( "#selectUserColor" ).val();

        // write general setting
        writeLocalStorage("settingUserColor", true);

        // write color code
        writeLocalStorage("settingUserColorName", userColor);
    }
    else
    {
        console.log("settingToggleUserColor ::: User color style is disabled");

        // user has NOT enabled a custom user color
        // fallback to default css
        writeLocalStorage("settingUserColor", false);

        settingUserColorReset();
    }
}


/**
* @name settingActivateUserColorCss
* @summary Activates a css style
* @description Activates a css style
* @param cssStyleName - Name of the css file
*/
function settingActivateUserColorCss(cssStyleName)
{
    console.log("settingActivateUserColorCss ::: Loading css style: " + cssStyleName);

    // load custom css file
    $("<link/>", {
        rel: "stylesheet",
        type: "text/css",
        href: "css/ttth/styles/" + cssStyleName
    }).appendTo("head");
}


/**
* @name updateTrayIconStatus
* @summary Updates the tray icon
* @description Checks the tabs of all services and fetches the content of the related batch. Based on the overall unread message account it triggers the update of the tray icon
*/
function updateTrayIconStatus()
{
    var overallUnreadMessages = 0;
    var curServiceUnreadMessageCount = 0;
    var serviceName = "";
    var currentTabId;

    // loop over all tabs - count unread messages
    $("#myTabs li a").each(function()
    {
        currentTabId = $(this).attr("id");

        if(currentTabId !== "target_Settings")
        {
            // FIXME
            currentTabId = currentTabId.replace("target_", "");

            console.log("updateTrayIconStatus ::: Check unread message badge of: _" + currentTabId + "_.");

            curServiceUnreadMessageCount = 0; // reset to 0
            curServiceUnreadMessageCount = $("#badge_" + currentTabId ).html();
            curServiceUnreadMessageCount = Number(curServiceUnreadMessageCount);

            // if the current service has a significant unread message count -> log it and add it to overall counter
            if( (curServiceUnreadMessageCount !== 0) && (curServiceUnreadMessageCount !== "") && (curServiceUnreadMessageCount !== null) )
            {
                console.log("updateTrayIconStatus ::: Unread messages count of service _" + serviceName + "_ is: " + curServiceUnreadMessageCount);

                // increate the overall counter
                overallUnreadMessages = overallUnreadMessages + curServiceUnreadMessageCount;
            }
        }
        else
        {
            console.log("updateTrayIconStatus ::: Ignoring settings-tab - as it has no badge.");
        }
    });

    console.log("updateTrayIconStatus ::: Overall unread message count is: _" + overallUnreadMessages + "_.");

    const {ipcRenderer} = require("electron");
    if( (overallUnreadMessages === "0" ) || (overallUnreadMessages === 0 ) )
    {
        // tray should show the default icon
        ipcRenderer.send("changeTrayIconToDefault");
    }
    else
    {
        // tray should show that we got unread messages
        ipcRenderer.send("changeTrayIconToUnreadMessages");
    }
}


/**
* @name updateServiceBadge
* @summary Updates the badge of a single service
* @description gets the name of a service and its current unread message count. Updates the badge of the related service
* @param serviceId - ID of the service
* @param count - Amount of unread messages
*/
function updateServiceBadge(serviceId, count)
{
    console.log("updateServiceBadge ::: New unread count for service _" + serviceId + "_ is: _" + count + "_.");

    if( (count === null) || (count === 0) || (count === "null"))
    {
        count = "";
    }

    // update the badge
    $( "#badge_" + serviceId).html( count );

    // Update tray icon status if needed
    updateTrayIconStatus();
}


/**
* @name openDevTools
* @summary Toggles DevConsole
* @description Opens or closes the Developer Console inside the app
*/
function openDevTools()
{
    console.log("openDevTools ::: Opening Developer Console");
    const remote = require("electron").remote;
    remote.getCurrentWindow().toggleDevTools();
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
    console.log("sendNotification ::: Sending a notification with the title _" + title + "_ and the message: _" + message + "_.");

    let myNotification = new Notification(title, {
        body: message,
        icon: "img/notification/icon_notification.png"
    });

    /*
    myNotification.onclick = () => {
        console.log("Notification clicked")
    }
    */
}


/**
* @name  settingToggleAutostart
* @summary Enables or disables the autostart
* @description Enables or disables the autostart
*/
function settingToggleAutostart()
{
    // auto-launch - via: https://www.npmjs.com/package/auto-launch
    var AutoLaunch = require("auto-launch");

    var ttthAutoLauncher = new AutoLaunch({
        name: "ttth",
        useLaunchAgent: true,
    });

    // Handle depending on the checkbox state
    if($("#checkboxSettingAutostart").prop("checked"))
    {
        ttthAutoLauncher.enable();

        writeLocalStorage("settingAutostart", true);

        console.log("settingToggleAutostart ::: Finished enabling Autostart");
    }
    else
    {
        ttthAutoLauncher.disable();

        writeLocalStorage("settingAutostart", false);
        writeLocalStorage("settingAutostartMinimized", false);

        // adjust UI:
        // make sure check checkfor for AutostartStartMinimized is unchecked as well
        $("#checkboxSettingAutostartMinimized").prop("checked", false);

        console.log("settingToggleAutostart ::: Finished disabling Autostart");
    }

    ttthAutoLauncher.isEnabled()
    .then(function(isEnabled){
        if(isEnabled){
            return;
        }
        ttthAutoLauncher.enable();
    })
    .catch(function(err){
        // handle error
    });
}


/**
* @name settingToggleAutostartMinimized
* @summary Enables or disables the autostart minimized
* @description Enables or disables the autostart minimized
*/
function settingToggleAutostartMinimized()
{
    // auto-launch - via: https://www.npmjs.com/package/auto-launch
    var AutoLaunch = require("auto-launch");

    if($("#checkboxSettingAutostartMinimized").prop("checked"))
    {
        // enable start minimized
        var ttthAutoLauncher = new AutoLaunch({
        name: "ttth",
        isHidden: true,
        useLaunchAgent: true,
        });

        // Write AutoStart & AutostartMinimized to local storage
        writeLocalStorage("settingAutostart", true);
        writeLocalStorage("settingAutostartMinimized", true);

        // adjust UI
        //
        // make sure general Autostart is checked as well
        $("#checkboxSettingAutostart").attr("checked", true);

        ttthAutoLauncher.enable();

        console.log("settingToggleAutostartMinimized ::: Finished enabling minimized Autostart");
    }
    else
    {
        // disable start minimized
        var ttthAutoLauncher = new AutoLaunch({
        name: "ttth",
        isHidden: false,
        useLaunchAgent: true,
        });

        // Write AutostartMinimized to local storage
        writeLocalStorage("settingAutostartMinimized", false);

        ttthAutoLauncher.enable();

        console.log("settingToggleAutostartMinimized ::: Finished disabling minimized Autostart");
    }
}


/**
* @name settingDefaultViewUpdate
* @summary Stores a new default view to local storage
* @description Users can define a default / startup view in settings. This method stores the users choice into local storage.
*/
function settingDefaultViewUpdate()
{
    // get currently selected value from select
    var newDefaultView = $( "#selectDefaultView" ).val();
    console.log("settingDefaultViewUpdate ::: New default view on start is set to: " + newDefaultView);

    // Store new default view in local storage
    writeLocalStorage("settingDefaultView", newDefaultView);
}


/**
* @name settingDefaultViewReset
* @summary Reset the stored default view
* @description Deletes the localstorage key 'settingDefaultview'
*/
function settingDefaultViewReset()
{
    // delete local storage key and its related value
    localStorage.removeItem("settingDefaultView");

    // reset the selection of the select item
    $("#selectDefaultView").prop("selectedIndex",0);

    console.log("settingDefaultViewReset ::: Did reset the default view");
}


/**
* @name settingToggleMenubarVisibility
* @summary Toggles the setting hideMenubar
* @description Enabled or disables the srtting Hide-Menubar-On-Startup
*/
function settingToggleMenubarVisibility()
{
    if($("#checkboxSettingHideMenubar").prop("checked"))
    {
        writeLocalStorage("settingHideMenubar", true);

        console.log("settingToggleMenubarVisibility ::: Hide menubar is enabled");

        // show noty
        showNoty("success", "Hide menubar on startup is now enabled (Settings).");
    }
    else
    {
        writeLocalStorage("settingHideMenubar", false);

        console.log("settingToggleMenubarVisibility ::: Hide menubar is disabled");

        // show noty
        showNoty("success", "Hide menubar on startup is now disabled (Settings).");
    }
}


/**
* @name checkSupportedOperatingSystem
* @summary Checks if the operating system is supported or not
* @description Checks if the operating system is linux. Everything else is untested so far.
*/
function checkSupportedOperatingSystem()
{
    var supportedOperatingSystemMessage = "";
    var userPlatform = process.platform;

    console.log("checkSupportedOperatingSystem ::: Detected operating system as: " + userPlatform);

    switch(userPlatform)
    {
        case "win32":
        case "windows":
        case "linux":
        case "darwin":
            console.log("checkSupportedOperatingSystem ::: Operating system " + userPlatform + " is fine." );

            // hide OS information
            $("#operatingSystemInformation").hide();

            break;

        default:
            // define message
            supportedOperatingSystemMessage = "Support for " + userPlatform + " is experimental.";

            // update the os-info text
            $("#operatingSystemInformation").html(supportedOperatingSystemMessage);

            // change class
            $("#operatingSystemInformation").attr("class", "alert alert-danger");

            // show os information
            $("#operatingSystemInformation").show();

            console.error("checkSupportedOperatingSystem ::: Operating system " + userPlatform + " - " + supportedOperatingSystemMessage );
    }
}


/**
* @name switchToService
* @summary Activates a given service tab
* @description Activates the tab of a given service. Needed for handling DefaultView setting.
* @param serviceName - Name of the service
*/
function switchToService(serviceName)
{
    console.log("switchToService ::: Switching to tab: " + serviceName);

    // activate the related tab
    $("#target_" + serviceName).trigger("click");
}


/**
* @name searchUpdate
* @summary Checks if there is a new release available
* @description Compares the local app version number with the tag of the latest github release. Displays a notification in the settings window if an update is available.
* @param silent - Boolean with default value. Shows a feedback in case of no available updates If "silent" = false. Special handling for manually triggered update search
*/
function searchUpdate(silent = true)
{
    var remoteAppVersionLatest = "0.0.0";

    var gitHubPath = "yafp/ttth";  // user/repo
    var url = "https://api.github.com/repos/" + gitHubPath + "/tags";

    console.log("searchUpdate ::: Start checking " + url + " for available releases");

    var updateStatus = $.get( url, function( data )
    {
        timeout:3000; // in milliseconds

        // success
        var versions = data.sort(function (v1, v2)
        {
            return semver.compare(v2.name, v1.name);
        });

        // remote version
        var remoteAppVersionLatest = versions[0].name;
        //remoteAppVersionLatest = "66.1.2"; // overwrite variable to simulate available updates

        // local version
        var localAppVersion = require("electron").remote.app.getVersion();

        console.log("searchUpdate ::: Local version: " + localAppVersion);
        console.log("searchUpdate ::: Latest public version: " + remoteAppVersionLatest);

        if( localAppVersion < remoteAppVersionLatest )
        {
            console.warn("searchUpdate ::: Found update, notify user");

            // update the updater-info text
            $("#updateInformation").html('ttth ' + remoteAppVersionLatest + ' is now available. See <a href="#" onClick=\'openURL("https://github.com/yafp/ttth/blob/master/CHANGELOG.md")\'>Changelog</a> for details. Download is available <a href="#" onClick=\'openURL("https://github.com/yafp/ttth/releases")\'>here</a>. <button type="button" class="close" onClick="hideUpdateInformation();" aria-label="Close"><span aria-hidden="true">&times;</span></button>');

            // show update information
            $("#updateInformation").show();

            // send notification
            //showNoty("success", "An update to version " + remoteAppVersionLatest + " is now available.", 0);
        }
        else
        {
            console.log("searchUpdate ::: No newer version found.");

            if(silent === true) // default case -> when executed on load
            {
                // hide update information
                $("#updateInformation").hide();

            }
            else // when executed manually via menu -> user should see result of this search
            {
                // update the updater-info text
                $("#updateInformation").html('You are running the latest version of ttth.  <button type="button" class="close" onClick="hideUpdateInformation();" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
            }
        }

        console.log("searchUpdate ::: Successfully checked " + url + " for available releases");
    })
    .done(function()
    {
        //console.log("searchUpdate ::: Successfully checked " + url + " for available releases");
    })

    .fail(function()
    {
        console.error("searchUpdate ::: Checking " + url + " for available releases failed.");

        $("#updateInformation").hide();
    })

    .always(function()
    {
        console.log("searchUpdate ::: Finished checking " + url + " for available releases");
    });
}


/**
* @name hideUpdateInformation
* @summary Hides the update information
* @description Hides the info div which shows hint regarding available update, link to changelog and link to release/download
*/
function hideUpdateInformation()
{
    console.log("hideUpdateInformation ::: Hiding update information div");

    // hide update information
    $("#updateInformation").hide();
}


/**
* @name validateConfiguredDefaultView
* @summary Checks on startup if the service configured as default view is a valid / enabled service
* @description Checks if the default view is valid, otherwise fallbacks to settings view
*/
function validateConfiguredDefaultView()
{
    // read from local storage
    var curDefaultView = readLocalStorage("settingDefaultView");

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
        $("#selectDefaultView option").each(function()
        {
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

            // load the default view
            loadDefaultView();
        }
        else
        {
            console.log("validateConfiguredDefaultView ::: Fallback to default (setting-view)");

            // reset the selection of the select item
            $("#selectDefaultView").prop("selectedIndex",0);

            // delete the localstorage entry for defaultview
            settingDefaultViewReset();
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
    // read from local storage
    var curDefaultView = readLocalStorage("settingDefaultView");

    if(curDefaultView === null) // no default view configured
    {
        console.log("loadDefaultView ::: No default configured");
    }
    else
    {
        console.log("loadDefaultView ::: Found configured default view: " + curDefaultView);
        switchToService(curDefaultView);
    }
}


/**
* @name openURL
* @summary Opens an url in browser
* @description Opens a given url in default browser
* @param url - URL string which contains the target url
*/
function openURL(url)
{
    const {shell} = require("electron");
    console.log("openURL ::: Trying to open the url: " + url);
    shell.openExternal(url);
}


/**
* @name loadServiceSpecificCode
* @summary Executes service specific javascript code on service-activation
* @description Executes service specific javascript code on service-activation
* @param serviceId
* @param serviceName - Name of the service
*/
function loadServiceSpecificCode(serviceId, serviceName)
{
    console.log("loadServiceSpecificCode ::: Checking for service-specific code for the service: " + serviceName + " with the id: _" + serviceId + "_.");

    switch (serviceName)
    {
        case "discord":
            break;

        case "dropbox":
            break;

        case "freenode":
            console.log("loadServiceSpecificCode ::: Executing " + serviceName + " specific things");
            serviceFreenodeAddEventListener(serviceId);
            break;

        case "gitHub":
            break;

        case "googleCalendar":
            break;

        case "googleContacts":
            break;

        case "googleDrive":
            break;

        case "googleKeep":
            break;

        case "googleMail":
            console.log("loadServiceSpecificCode ::: Executing " + serviceName + " specific things");
            serviceGoogleMailAddEventListener(serviceId);
            break;

        case "googleMessages":
            console.log("loadServiceSpecificCode ::: Executing " + serviceName + " specific things");
            serviceGoogleMessagesAddEventListener(serviceId);
            break;

        case "googlePhotos":
            break;

        case "mattermost":
            console.log("loadServiceSpecificCode ::: Executing " + serviceName + " specific things");
            serviceMattermostAddEventListener(serviceId);
            break;

        case "nextcloud":
            break;

         case "slack":
            console.log("loadServiceSpecificCode ::: Executing " + serviceName + " specific things");
            serviceSlackAddEventListener(serviceId);
            break;

        case "telegram":
            console.log("loadServiceSpecificCode ::: Executing " + serviceName + " specific things");
            serviceTelegramAddEventListener(serviceId);
            break;

        case "threema":
            console.log("loadServiceSpecificCode ::: Executing " + serviceName + " specific things");
            serviceThreemaAddEventListener(serviceId);
            break;

        case "twitter":
            console.log("loadServiceSpecificCode ::: Executing " + serviceName + " specific things");
            serviceTwitterAddEventListener(serviceId);
            break;

        case "whatsapp":
            console.log("loadServiceSpecificCode ::: Executing " + serviceName + " specific things");
            //loadSingleServiceSpecificJavascriptFile("WhatsApp.js");
            serviceWhatsAppRegister();
            serviceWhatsAppAddEventListener(serviceId);
            break;

        case "xing":
            console.log("loadServiceSpecificCode ::: Executing " + serviceName + " specific things");
            serviceXingAddEventListener(serviceId);
            break;

        default:
            console.log("loadServiceSpecificCode ::: Nothing to do here");
    }
}





/*
function loadSingleServiceSpecificJavascriptFile(scriptname)
{

    console.log("loadSingleServiceSpecificJavascriptFile ::: Starting to load a single .js file for a specific service");

    $.getScript("js/ttth/services/" + scriptname, function( data, textStatus, jqxhr )
    {
        //console.log( data ); // Data returned
        console.log( textStatus ); // Success
        console.log( jqxhr.status ); // 200
        console.log( "Load _" + scriptname + "_ was performed." );

        // this is your callback.
        //alert("loading _" + scriptname + "_ was done.");
    });
    console.log("loadSingleServiceSpecificJavascriptFile ::: Finished including service specific .js files");
}
*/






/**
* @name initSettingsPage
* @summary Initializes the settings page
* @description Shows links to github informations. update informations. Initializes the service-checkboxes on loading the view
*/
function initSettingsPage()
{
    var curSettingAutostart;
    var curSettingAutostartMinimized;
    var curSettingHideMenubar;
    var curSettingUserColor;
    var curSettingUserColorCode;

    // load all supported services to checklist
    initAvailableServicesSelection();

    // load all user enabled services
    loadConfiguredUserServices();


    // Setting: DefaultView - now validate the optional configured default view
    //
    //validateConfiguredDefaultView();

    // Setting: Autostart
    //
    curSettingAutostart = readLocalStorage("settingAutostart");
    if(curSettingAutostart === "true")
    {
        console.log("initSettingsPage ::: Setting Autostart is configured");

        // activate checkbox
        $("#checkboxSettingAutostart").prop("checked", true);
    }
    else
    {
        console.log("initSettingsPage ::: Setting Autostart is not configured");
    }


    // Setting: AutostartMinimized
    //
    curSettingAutostartMinimized = readLocalStorage("settingAutostartMinimized");
    if(curSettingAutostartMinimized === "true")
    {
        console.log("initSettingsPage ::: Setting AutostartMinimized is configured");

        // activate checkbox
        $("#checkboxSettingAutostart").prop("checked", true);
        $("#checkboxSettingAutostartMinimized").prop("checked", true);
    }
    else
    {
        console.log("initSettingsPage ::: Setting AutostartMinimized is not configured");
    }


    // Setting: HideMenubar (is platform specific - as function is not supported on darwin)
    //
    const {ipcRenderer} = require("electron");
    curSettingHideMenubar = readLocalStorage("settingHideMenubar");

    if(isMac())
    {
        // ensure the setting is disabled
        writeLocalStorage("settingHideMenubar", "false");

        // hide the entire setting on settingspage
        $("#settingsSectionStartupHideMenubar").hide();
    }
    else // default case (linux or windows)
    {
        if(curSettingHideMenubar === "true")
        {
            // hide menubar
            console.log("initSettingsPage ::: Hide menubar");
            $("#checkboxSettingHideMenubar").prop("checked", true);
            ipcRenderer.send("hideMenubar");
        }
        else
        {
            // show menubar
            ipcRenderer.send("showMenubar");
            $("#checkboxSettingHideMenubar").prop("checked", false);
            console.log("initSettingsPage ::: Show menubar");
        }
    }

    // Setting: UserColor
    //
    curSettingUserColor = readLocalStorage("settingUserColor");
    if(curSettingUserColor === "true")
    {
        console.log("initSettingsPage ::: Setting UserColor is configured");

        // activate checkbox
        $("#checkboxSettingUserColor").prop("checked", true);

        // read color code
        curSettingUserColorCode = readLocalStorage("settingUserColorName");

        // adjust select
        $("#selectUserColor").val(curSettingUserColorCode);


        settingActivateUserColorCss(curSettingUserColorCode);
    }
    else
    {
        console.log("initSettingsPage ::: Setting UserColor is not configured");

        settingActivateUserColorCss("default.css");
    }
}


/**
* @name settingsToggleSingleConfiguredUserServiceCheckbox
* @summary Enables or disabled the status of a single user configured service
* @description User can enable or disable his configured services in settings page.
* @param configuredUserServiceConfigName - Name of the config file of the selected service
*/
function settingsToggleSingleConfiguredUserServiceCheckbox(configuredUserServiceConfigName)
{
    console.log("settingsToggleSingleConfiguredUserServiceCheckbox ::: Toggling the configured service defined in config file: _" + configuredUserServiceConfigName + "_.");

    const os = require('os');
    const storage = require('electron-json-storage');
    const dataPath = storage.getDataPath();

    var serviceEnableStatus;

    var type;
    var name;
    var icon;
    var url;
    var injectCode;

    // get content from service configuration file
    storage.get(configuredUserServiceConfigName, function(error, data) {
        if (error) throw error;

        type = data.type;
        name = data.name;
        icon = data.icon;
        url =  data.url;
        injectCode = data.injectCode;


        // get status of enable/disable button:
        if( $("#bt_" + configuredUserServiceConfigName).attr("title") === "enabled")
        {
            // is enabled - so disable it

            // Status Button
            //
            // update button type
            $("#bt_" + configuredUserServiceConfigName).removeClass();
            $("#bt_" + configuredUserServiceConfigName).addClass("btn btn-secondary btn-sm");
            // update button title
            $("#bt_" + configuredUserServiceConfigName).prop("title", "disabled");
            // update button icon
            $("#statusIconService_" + configuredUserServiceConfigName).removeClass();
            $("#statusIconService_" + configuredUserServiceConfigName).addClass("fas fa-toggle-off");

            // set serviceEnableStatus variable
            serviceEnableStatus = false;

            // remove service tab
            removeServiceTab(configuredUserServiceConfigName);

            console.log("settingsToggleSingleConfiguredUserServiceCheckbox ::: Service _" + configuredUserServiceConfigName + "_ is now disabled.");
        }
        else {
            // is disabled - so enable it

            // Status Button
            //
            // update button type
            $("#bt_" + configuredUserServiceConfigName).removeClass();
            $("#bt_" + configuredUserServiceConfigName).addClass("btn btn-success btn-sm");
            // update button title
            $("#bt_" + configuredUserServiceConfigName).prop("title", "enabled");
            // update button icon
            $("#statusIconService_" + configuredUserServiceConfigName).removeClass();
            $("#statusIconService_" + configuredUserServiceConfigName).addClass("fas fa-toggle-on");

            // set serviceEnableStatus variable
            serviceEnableStatus = true;

            // add tab for this enabled service
            addServiceTab(configuredUserServiceConfigName, type, name, icon, url, injectCode);

            // add service to selectDefaultView
            $("#selectDefaultView").append(new Option(name, configuredUserServiceConfigName));

            console.log("settingsToggleSingleConfiguredUserServiceCheckbox ::: Service _" + configuredUserServiceConfigName + "_ is now enabled.");
        }

        // update the config of the configured service (status)
        storage.set(configuredUserServiceConfigName, {
            "type": type,
            "name": name,
            "icon": icon,
            "url": url,
            "injectCode": injectCode,
            serviceEnableStatus: serviceEnableStatus
        }, function(error)
        {
            if (error) throw error;
        });
    });

    console.log("settingsToggleSingleConfiguredUserServiceCheckbox ::: Service _" + configuredUserServiceConfigName + "_ config file is now updated (status)");
}


/**
* @name loadEnabledUserServices
* @summary Reads all user configured service files and adds the enabled ones
* @description Reads all user configured service files and adds the enabled ones
*/
function loadEnabledUserServices()
{
    const storage = require('electron-json-storage');

    console.log("loadEnabledUserServices ::: Starting to fetch all user configured service files");

    // loop over all json files - add tab for the enabled ones
    storage.getAll(function(error, data)
    {
        if (error) throw error;

        // show object which contains all config files
        //console.error(data);
        console.log("loadEnabledUserServices ::: Current service: " + data);
        //console.error(typeof data);

        // loop over upper object
        for (var key in data)
        {
            if (data.hasOwnProperty(key))
            {
                console.log("loadEnabledUserServices ::: " + key);
                console.log("loadEnabledUserServices ::: " + key + " -> " + data[key]);
                //console.error(data[key]["type"]);

                if(data[key]["serviceEnableStatus"] === true) // show enabled configured service
                {
                    console.log("loadEnabledUserServices ::: Trying to add the enabled service: _" + key + "_.");
                    addServiceTab(key, data[key]["type"], data[key]["name"], data[key]["icon"], data[key]["url"], data[key]["injectCode"]);

                    // add service to selectDefaultView
                    //$("#selectDefaultView").append(new Option(data[key]["name"], key));

                }
                else
                {
                    console.log("loadEnabledUserServices ::: Skipped service: _" + key + "_, as it not enabled.");
                }
            }
        }
        console.log("loadEnabledUserServices ::: Finished current service: " + data);
    });
}


/**
* @name deleteConfiguredService
* @summary Deletes a single configured user service
* @description Removes the tab, deletes the service user config, reloads the settings view which shows all user configured services.
*/
function deleteConfiguredService(serviceId)
{
    console.log("deleteConfiguredService ::: Deleting the user service: _" + serviceId + "_.");

    // remove tab
    removeServiceTab(serviceId);

    // delete config
    const storage = require('electron-json-storage');
    storage.remove(serviceId, function(error) {
      if (error) throw error;
    });

    // reload all configured user services to settings page
    loadConfiguredUserServices();

    console.log("deleteConfiguredService ::: Finished deleting the user service: _" + serviceId + "_.");
}


/**
* @name loadConfiguredUserServices
* @summary updates the settings view which shows all configured user services.
* @description removes all configured user services from settings view, reads all configured user services and re-adds
*/
function loadConfiguredUserServices()
{
    const storage = require('electron-json-storage');

    // empty the div
    $( "#settingsServicesConfigured" ).empty();





    // reset the select for defaultview
    // baustelle
    //let dropdown = $('#selectDefaultView');
    // Empty the select
    //dropdown.empty();

    // Add a disabled dummy/default entry
    //dropdown.append('<option selected="true" disabled>Please choose</option>');








    // read all user service files
    storage.getAll(function(error, data)
    {
        if (error) throw error;

        // show object which contains all config files
        //console.error(data);
        //console.error(typeof data);

        var serviceCount = 0;

        // loop over upper object
        for (var key in data)
        {
            if (data.hasOwnProperty(key))
            {
                //console.log("loadConfiguredUserServices ::: " + key);
                console.log("loadConfiguredUserServices ::: " + key + " -> " + data[key]);

                // show 2 services per row
                if (serviceCount%2 === 0) // Odd
                {
                    // create a new row
                    $( "#settingsServicesConfigured" ).append('<div class="row" id="conf_' + serviceCount + '"></div>');

                    if(data[key]["serviceEnableStatus"] === true) // show enabled configured service
                    {
                        //$( "#conf_" + serviceCount ).append('<div class="col-sm-6"><div class="input-group input-group-sm mb-1"><div class="input-group-prepend"><div class="input-group-text"><input type="checkbox" id="checkbox_'+ key + '" name=' + key + ' checked onClick="settingsToggleSingleConfiguredUserServiceCheckbox(\''  + key + '\');"></div></div><input type="text" class="form-control" id="label_' + data[key]["url"] + '" aria-label="Text input with checkbox" value='+ data[key]["name"] +' title=' + data[key]["url"] + ' disabled><div class="input-group-prepend"><button type="button" class="btn btn-success btn-sm" id="bt_'+ key +'" title="enabled" disabled><i id=statusIconService_'+ key +' class="fas fa-toggle-on"></i></button><button type="button" class="btn btn-danger btn-sm" id="bt_delete'+ key +'" title="delete" onClick="deleteConfiguredService(\''  + key + '\');"><i class="fas fa-trash-alt"></i></button></div></div></div>');

                        $( "#conf_" + serviceCount ).append('<div class="col-sm-6"><div class="input-group input-group-sm mb-1"><div class="input-group-prepend"><div class="input-group-text"><i class="' + data[key]["icon"] +'"></i></div></div><input type="text" class="form-control" id="label_' + data[key]["url"] + '" aria-label="Text input with checkbox" value='+ data[key]["name"] + ' title=' + data[key]["url"] + ' disabled><div class="input-group-prepend"><button type="button" id="bt_configSingleService_'+ key +'" class="btn btn-dark" onClick="configureSingleUserService(\''  + key + '\')"><i class="fas fa-cog"></i></button><button type="button" class="btn btn-success btn-sm" id="bt_'+ key +'" title="enabled" onClick="settingsToggleSingleConfiguredUserServiceCheckbox(\''  + key + '\');"><i id=statusIconService_'+ key +' class="fas fa-toggle-on"></i></button><button type="button" class="btn btn-danger btn-sm" id="bt_delete'+ key +'" title="delete" onClick="deleteConfiguredService(\''  + key + '\');"><i class="fas fa-trash-alt"></i></button></div></div></div>');

                    }
                    else // show disabled configured service
                    {
                        $( "#conf_" + serviceCount ).append('<div class="col-sm-6"><div class="input-group input-group-sm mb-1"><div class="input-group-prepend"><div class="input-group-text"><i class="' + data[key]["icon"] +'"></i></div></div><input type="text" class="form-control" id="label_' + data[key]["url"] + '" aria-label="Text input with checkbox" value='+ data[key]["name"] +' title=' + data[key]["url"] + ' disabled><div class="input-group-prepend"><button type="button" id="bt_configSingleService_'+ key +'" class="btn btn-dark" onClick="configureSingleUserService(\''  + key + '\')"><i class="fas fa-cog"></i></button><button type="button" class="btn btn-secondary btn-sm" id="bt_'+ key +'" title="disabled" onClick="settingsToggleSingleConfiguredUserServiceCheckbox(\''  + key + '\');"><i id=statusIconService_'+ key +' class="fas fa-toggle-off"></i></button><button type="button" class="btn btn-danger btn-sm" id="bt_delete'+ key +'" title="delete" onClick="deleteConfiguredService(\''  + key + '\');"><i class="fas fa-trash-alt"></i></button></div></div></div>');
                    }
                }
                else // ...even - add to existing row - in col 2
                {
                    // add something to the existing row
                    var rowReference = serviceCount -1;

                    if(data[key]["serviceEnableStatus"] === true) // show enabled configured service
                    {
                        $( "#conf_" + rowReference  ).append('<div class="col-sm-6"><div class="input-group input-group-sm mb-1"><div class="input-group-prepend"><div class="input-group-text"><i class="' + data[key]["icon"] +'"></i></div></div><input type="text" class="form-control" id="label_' + data[key]["url"] + '" aria-label="Text input with checkbox" value='+ data[key]["name"]+' title=' + data[key]["url"] + ' disabled><div class="input-group-prepend"><button type="button" id="bt_configSingleService_'+ key +'" class="btn btn-dark" onClick="configureSingleUserService(\''  + key + '\')"><i class="fas fa-cog"></i></button><button type="button" class="btn btn-success btn-sm" id="bt_'+ key +'" title="enabled" onClick="settingsToggleSingleConfiguredUserServiceCheckbox(\''  + key + '\');"><i id=statusIconService_'+ key +' class="fas fa-toggle-on"></i></button><button type="button" class="btn btn-danger btn-sm" id="bt_delete'+ key +'" title="delete" onClick="deleteConfiguredService(\''  + key + '\');"><i class="fas fa-trash-alt"></i></button></div></div></div>');

                    }
                    else // show disabled configured service
                    {
                        $( "#conf_" + rowReference  ).append('<div class="col-sm-6"><div class="input-group input-group-sm mb-1"><div class="input-group-prepend"><div class="input-group-text"><i class="' + data[key]["icon"] +'"></i></div></div><input type="text" class="form-control" id="label_' + data[key]["url"] + '" aria-label="Text input with checkbox" value='+ data[key]["name"] +' title=' + data[key]["url"] + ' disabled><div class="input-group-prepend"><button type="button" id="bt_configSingleService_'+ key +'" class="btn btn-dark" onClick="configureSingleUserService(\''  + key + '\')"><i class="fas fa-cog"></i></button><button type="button" class="btn btn-secondary btn-sm" id="bt_'+ key +'" title="disabled" onClick="settingsToggleSingleConfiguredUserServiceCheckbox(\''  + key + '\');"><i id=statusIconService_'+ key +' class="fas fa-toggle-off"></i></button><button type="button" class="btn btn-danger btn-sm" id="bt_delete'+ key +'" title="delete" onClick="deleteConfiguredService(\''  + key + '\');"><i class="fas fa-trash-alt"></i></button></div></div></div>');
                    }
                }
                serviceCount = serviceCount +1;
            }
        }
    });

    console.log("loadConfiguredUserServices ::: Finished loading all configured user services to settings page");
}


/**
* @name settingsUserAddNewService
* @summary user wants to configure a new service
* @description user wants to configure a new service
*/
function settingsUserAddNewService()
{
    console.log("settingsUserAddNewService ::: Starting to add a new user configured service.");

    const os = require('os');
    const storage = require('electron-json-storage');
    const dataPath = storage.getDataPath();

    var serviceAllowsMultipleInstances;

    // get selected option from #select_availableServices
    var userSelectedService = $( "#select_availableServices" ).val();
    console.log(userSelectedService);

    if( userSelectedService !== null )
    {
        console.log("settingsUserAddNewService ::: Should add a new service of type: _" + userSelectedService + "_.");

        // check if this service allows multiple instances
        console.log("settingsUserAddNewService ::: Checking if the service: _" + userSelectedService + "_ allows multiple instances");
        // Parse service template
        const url = __dirname + "/js/ttth/services.json";
        $.getJSON(url, function (data)
        {
            $.each(data, function (key, entry)
            {
                if(entry.id === userSelectedService)
                {
                    // check if it allows multiple instances
                    if(entry.multiple == true)
                    {
                        console.log("settingsUserAddNewService ::: Service: _" + userSelectedService + "_ allows multiple instances");
                        serviceAllowsMultipleInstances = true;

                        createServiceFile(userSelectedService, entry.name, entry.icon, entry.url, entry.injectCode)
                    }
                    else // single instance service
                    {
                        console.warn("settingsUserAddNewService ::: Service: _" + userSelectedService + "_ does NOT allows multiple instances");
                        console.log("settingsUserAddNewService ::: Check if there already exists an instance of the service type: _" + userSelectedService + "_.");

                        // check if there is already a configured service of that type.
                        // check which configs already exist
                        storage.getAll(function(error, data)
                        {
                            if (error) throw error;

                            // show object which contains all config files
                            console.log(data);
                            //console.error(typeof data);

                            for (var key in data)
                            {
                                if (data.hasOwnProperty(key))
                                {
                                    //console.log(key + " -> " + data[key]);
                                    //console.warn(data[key]);

                                    console.log(data[key]["type"]);

                                    if(data[key]["type"] === userSelectedService)
                                    {
                                        const { dialog } = require('electron').remote

                                        const options = {
                                            type: 'warning',
                                            buttons: ['OK'],
                                            icon: __dirname + "/img/icon/icon.png",
                                            defaultId: 0,
                                            title: 'Adding a service failed',
                                            message: "There is already a configured service of the type " + userSelectedService + ".",
                                            //detail: 'It does not really matter',
                                            //checkboxLabel: 'Remember my answer',
                                            //checkboxChecked: true,
                                        };

                                        dialog.showMessageBox(null, options, (response, checkboxChecked) => {
                                            console.log(response);
                                            console.log(checkboxChecked);
                                        });

                                        return;
                                    }
                                }
                            }

                            createServiceFile(userSelectedService, entry.name, entry.icon, entry.url, entry.injectCode)
                        });

                    }
                }
            })
        });
    }
    else
    {
        console.warn("settingsUserAddNewService ::: No service type selected. Unable to add a new service.");
    }
}




//  generates a local file for each user configured service in the DataDir
/**
* @name createServiceFile
* @summary creates the .json file for a new user configured service
* @description creates the .json file for a new user configured service
* @param serviceType
* @param serviceName
* @param serviceIcon
* @param serviceUrl
* @param serviceInjectCode
*/
function createServiceFile(serviceType, serviceName, serviceIcon, serviceUrl, serviceInjectCode)
{
    console.log("createServiceFile ::: Starting to create a new .json file for a user configured service");

    const os = require('os');
    const storage = require('electron-json-storage');
    const dataPath = storage.getDataPath();

    // generate a random id (used as filename) for the new service:
    var randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    var newServiceId = randomString + "_" + serviceType



    const prompt = require("electron-prompt");

    prompt({
        title: "Service: " + serviceType,
        label: "Please insert your <b>URL</b>.",
        value: serviceUrl,
        useHtmlLabel: true,
        resizable: false,
        width: 450,
        height: 200,
        inputAttrs: {
            type: "url",
            required: true,
            placeholder: "https://example.com"
        },
        icon: __dirname + "/img/icon/icon.png",
        menuBarVisible: false
    })
    .then((r) => {
        if( (r === null) || (r === "") )
        {
            // User cancelled the URL dialog or confirmed empty input.");
        }
        else
        {
            serviceUrl = r;

            // do everything
            storage.set( newServiceId,
            {
                serviceEnableStatus: true,
                type: serviceType,
                name: serviceName,
                icon: serviceIcon,
                url: serviceUrl,
                injectCode: serviceInjectCode

            }, function(error)
            {
                if (error) throw error;
            });

            // FIXME
            // is broken
            addServiceTab(newServiceId, serviceType, serviceName, serviceIcon, serviceUrl, serviceInjectCode);
            loadConfiguredUserServices();
        }
    })
    .catch(console.error);

    console.log("createServiceFile ::: Finished creation of .json file for a user configured service");
}



/**
* @name initAvailableServicesSelection
* @summary fills the select item in settings-page (which features all supported services)
* @description fills the select item in settings-page (which features all supported services)
*/
function initAvailableServicesSelection()
{
    console.log("initAvailableServicesSelection ::: Reload settings select with all supported service definitions");

    var counterSupportedServices = 0;

    // get reference to select which contains all supported service type definitions
    let dropdown = $('#select_availableServices');

    // Empty the select
    dropdown.empty();

    // Add a disabled dummy/default entry
    dropdown.append('<option selected="true" disabled>Choose a service</option>');
    dropdown.prop('selectedIndex', 0);

    // url to service definitions
    const url = __dirname + "/js/ttth/services.json";

    // Populate select with list of provinces
    $.getJSON(url, function (data)
    {
        $.each(data, function (key, entry)
        {
            // add option to select
            //
            dropdown.append($('<option></option>').attr('value', entry.id).text(entry.nameLong));

            counterSupportedServices = counterSupportedServices +1;
        });

        console.log("initAvailableServicesSelection ::: Finished reloading settings select with all supported service definitions. Found _" + counterSupportedServices + "_ service types.");

    });
}


/**
* @name addServiceTab
* @summary Add a single tab to UI
* @description Add the li item to tab menu, adds the tab itself
* @param serviceId
* @param serviceType
* @param serviceName
* @param serviceIcon
* @param serviceUrl
* @param serviceInjectCode
*/
function addServiceTab(serviceId, serviceType, serviceName, serviceIcon, serviceUrl, serviceInjectCode)
{
    console.log("addServiceTab ::: Starting to add the tab: _" + serviceId + "_.");

    // get amount of tabs
    var existingTabs = $("#myTabs li").length;

    // calculate new tab position
    var newTabPosition = existingTabs -2;

    // add new list item to unordner list (tabs/menu)
    //
    $('#myTabs li:eq(' + newTabPosition + ')').after('<li class="nav-item small" id=menu_'+ serviceId +'><a class="nav-link my-ui-text" id=target_' + serviceId +' href=#' + serviceId + ' role="tab" data-toggle="tab"><i class="' + serviceIcon +'"></i> ' + serviceName + ' <span id=badge_' + serviceId + ' class="badge badge-success"></span></a></li>');
    console.log("addServiceTab :::Added the navigation tab for service: _" + serviceId + "_.");

    // add the tab itself to #tabPanes
    $( "#tabPanes" ).append( '<div role="tabpanel" class="tab-pane fade flex-fill resizer container-fluid" id=' + serviceId + '></div>' );
    console.log("addServiceTab :::Added the tab pane for service: _" + serviceId + "_.");

    // add webview  to new tab
    $( "#"+ serviceId ).append( '<webview id=webview_' + serviceId + ' class="inner" src=' + serviceUrl + ' preload='+ serviceInjectCode + ' userAgent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36"></webview>' );
    console.log("addServiceTab :::Added the webview to the tab pane for service: _" + serviceId + "_.");

    console.log("addServiceTab ::: Finished adding the tab: _" + serviceId + "_.");

    // add service to select for DefaultView
    $("#selectDefaultView").append(new Option(serviceName, serviceId));

    loadServiceSpecificCode(serviceId, serviceType);
}


/**
* @name removeServiceTab
* @summary Remove a single tab from UI
* @description Removes the li item fromtab menu, removed the tab itself
* @param tabId
*/
function removeServiceTab(tabId)
{
    console.log("removeServiceTab ::: Starting to remove the tab: _" + tabId + "_.");

    // remove item from menu
    $('#menu_'+tabId).remove();

    // remove tabcontent from tab pane
    $('#'+tabId).remove();

    // remove service from select for DefaultView
    $("#selectDefaultView option[value=" + tabId + "]").remove();

    console.log("removeServiceTab ::: Finished removing the tab: _" + tabId + "_.");
}



/**
* @name setAccesskeysForEnabledServices
* @summary Assigns accesskeys for all service tabs
* @description Assigns accesskeys for all service tabs
*/
function setAccesskeysForEnabledServices()
{
    console.log("setAccesskeysForEnabledServices ::: Starting to define accesskeys for enabled services");

    var tabCounter = 0;

    // get list of all visible service-tabs
    $("#myTabs li a").each(function()
    {
        currentTabId = $(this).attr("id");

        if(currentTabId !== "target_Settings")
        {
            tabCounter = tabCounter +1;

            console.log("setAccesskeysForEnabledServices ::: Set accesskey for tab: _" + currentTabId + "_ to: _" + tabCounter + "_.");
            $("#" + currentTabId).attr("accesskey", tabCounter);
        }
        else {
            console.log("setAccesskeysForEnabledServices ::: Ignoring settings tab.");
        }
    });

    // show notification
    if(tabCounter > 0) // if at least 1 accesskey was set
    {
        //showNoty("success", "Updating accesskeys for enabled service tabs.")
    }

    console.log("setAccesskeysForEnabledServices ::: Finished assigning accesskeys for enabled services & related tabs");
}


/**
* @name localizeUserInterface
* @summary Localizes the user interface
* @description Is using i18next to localize the user interface. Translations are located in app/locales
*/
function localizeUserInterface()
{
    var userLang = navigator.language || navigator.userLanguage;

    // for development screenshot - overwrite the language to EN if the project is not packaged
    const isDev = require('electron-is-dev');
    if (isDev)
    {
        userLang = "en";
    }

    console.log("localizeUserInterface ::: Detected user language: " + userLang);

    var i18next = require("i18next");
    var Backend = require("i18next-sync-fs-backend");
    //var LanguageDetector = require("i18next-electron-language-detector");

    i18next
    .use(Backend)
    //.use(LanguageDetector)
    .init({
        debug: true,
        whitelist: ["en", "de"],
        lng: userLang,
        fallbackLng: "en",
        ns: "translation",
        defaultNS: "translation",
        updateMissing: false,
        initImmediate: true,
        backend:
        {
            // path where resources get loaded from
            loadPath: __dirname + "/locales/{{lng}}/{{ns}}.json",

            // path to post missing resources
            addPath: __dirname +  "/locales/{{lng}}/{{ns}}.missing.json",

            // jsonIndent to use when storing json files
            jsonIndent: 2
        }
    });

    $(function()
    {
        $("[i18n-text]").each(function()
        {
            var node = $(this), key = node.attr("i18n-text");
            node.text(i18next.t(key));
        });
        $("[i18n-title]").each(function()
        {
            var node = $(this), key = node.attr("i18n-title");
            node.attr("title", i18next.t(key));
        });
    });
}


// Call from main.js ::: reloadCurrentService
//
require("electron").ipcRenderer.on("reloadCurrentService", function(event, message)
{
    //console.log(message);  // Prints "whoooooooh!"

    // get href of current active tab
    var tabValue = $(".nav-tabs .active").attr("href");
    tabValue = tabValue.substring(1); // cut the first char ( =  #)
    console.log("reloadCurrentService ::: Current active tab is: " + tabValue);

    const storage = require('electron-json-storage');

    storage.get(tabValue, function(error, data) {
        if (error) throw error;

        url =  data.url;
        injectCode = data.injectCode;

        //console.log(data);
        document.getElementById( "webview_" + tabValue ).loadURL(url);
    });
});


// Call from main.js ::: showSettings
//
require("electron").ipcRenderer.on("showSettings", function(event)
{
    console.log("showSettings ::: Switching to Settings tab");
    switchToService("Settings");
});


// Call from main.js ::: startSearchUpdates
//
require("electron").ipcRenderer.on("startSearchUpdates", function(event)
{
    console.log("startSearchUpdates ::: Show update information div");

    // show update information
    $("#updateInformation").show();

    searchUpdate(false);
});


// Call from main.js ::: nextTab
//
require("electron").ipcRenderer.on("nextTab", function(event)
{
    // variables
    var currentTabId;
    var enabledTabsArray = []; // should store all visible names
    var currentActiveTabId; // Id of active tab
    var serviceName; // used to call  the function switchToService()

    // get current selected / active tab
    currentActiveTabId = $(".nav-item .active").attr("id");
    currentActiveTabId = currentActiveTabId.replace("target_", "");
    console.log("nextTab ::: Active tab is: " + currentActiveTabId);

    // get list of all visible service-tabs
    $("#myTabs li a").each(function()
    {
        currentTabId = $(this).attr("id");

        // check if entry is visible or not
        if($("#"+currentTabId).is(":visible"))
        {
            currentTabId = currentTabId.replace("target_", "");
            if(currentTabId !== "Settings")
            {
                enabledTabsArray.push(currentTabId);
            }
        }
    });

    // find position of current tab in the array of enabled services
    var currentPositionInArray = enabledTabsArray.indexOf(currentActiveTabId);

    // get next array position
    if(currentPositionInArray < enabledTabsArray.length -1) //
    {
        serviceName = enabledTabsArray[currentPositionInArray+1];
    }
    else
    {
        serviceName = enabledTabsArray[0];
    }

    console.log("nextTab ::: Should switch to: " + serviceName + " now.");

    // jump to next tab
    switchToService(serviceName);
});


// Call from main.js ::: previousTab
//
require("electron").ipcRenderer.on("previousTab", function(event)
{
    // variables
    var currentTabId;
    var enabledTabsArray = []; // should store all visible names
    var currentActiveTabId; // Id of active tab
    var serviceName; // used to call  the function switchToService()

    // get current selected / active tab
    currentActiveTabId = $(".nav-item .active").attr("id");
    currentActiveTabId = currentActiveTabId.replace("target_", "");
    console.log("previous ::: Active tab is: " + currentActiveTabId);

    // get list of all visible service-tabs
    $("#myTabs li a").each(function()
    {
        currentTabId = $(this).attr("id");

        // check if entry is visible or not
        if($("#"+currentTabId).is(":visible"))
        {
            currentTabId = currentTabId.replace("target_", "");
            if(currentTabId !== "Settings")
            {
                enabledTabsArray.push(currentTabId);
            }
        }
    });

    // find position of current tab in the array of enabled services
    var currentPositionInArray = enabledTabsArray.indexOf(currentActiveTabId);

    // get previous array position
    if(currentPositionInArray > 0) //
    {
        serviceName = enabledTabsArray[currentPositionInArray-1];
    }
    else
    {
        serviceName = enabledTabsArray[enabledTabsArray.length -1];
    }

    console.log("previousTab ::: Should switch to: " + serviceName + " now.");

    // jump to previous tab
    switchToService(serviceName);
});




// Call from main.js ::: serviceToConfigure (in secondWindow)
//
require("electron").ipcRenderer.on("serviceToConfigure", function(event, serviceId)
{
    console.log("serviceToConfigure ::: Should configure the service: " + serviceId);

    const storage = require('electron-json-storage');

    console.log("serviceToConfigure ::: Loading current values to UI");

    storage.get(serviceId, function(error, data) {
        if (error) throw error;

        type = data.type;
        name = data.name;
        icon = data.icon;
        url =  data.url;
        injectCode = data.injectCode;
        status = data.serviceEnableStatus;


        // update UI of second window
        $("#input_serviceId").val(serviceId);
        $("#input_serviceType").val(type);
        $("#input_serviceName").val(name);
        $("#input_serviceIcon").val(icon);
        $("#input_serviceUrl").val(url);
        $("#input_serviceInjectCode").val(injectCode);
        $("#input_serviceEnableStatus").val(status);

    });
});
