/* global _ */



/**
* @name isMac
* @summary Checks if the operating system type is mac/darwin or not
* @description Checks if the operating system type is mac/darwin or not
* @return value - Boolean: True if mac, false if not
*/
function isMac()
{
    console.log("isMac ::: Start");

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
* @name updateTrayIconStatus
* @summary Updates the tray icon
* @description Checks the tabs of all services and fetches the content of the related batch. Based on the overall unread message account it triggers the update of the tray icon
*/
function updateTrayIconStatus()
{
    console.log("updateTrayIconStatus ::: Start");

    var overallUnreadMessages = 0;
    var curServiceUnreadMessageCount = 0;
    var serviceName = "";

    // loop over all services and count the unread messages badge value together
    var arrayLength = ttthAvailableServices.length;
    for (var i = 0; i < arrayLength; i++)
    {
        serviceName = ttthAvailableServices[i];

        curServiceUnreadMessageCount = 0;

        // get value of current service from tab
        curServiceUnreadMessageCount = $("#badge_" + serviceName ).html();

        // if the current service has a significant unread message count -> log it and add it to overall counter
        if( (curServiceUnreadMessageCount !== 0) && (curServiceUnreadMessageCount !== "") && (curServiceUnreadMessageCount !== null) )
        {
            console.log("updateTrayIconStatus ::: Unread messages count of service _" + serviceName + "_ is: " + curServiceUnreadMessageCount);

            // increate the overall counter
            overallUnreadMessages = overallUnreadMessages + curServiceUnreadMessageCount;
        }
    }

    console.log("updateTrayIconStatus ::: Overall unread message count is: " + overallUnreadMessages);

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

    console.log("updateTrayIconStatus ::: End");
}


/**
* @name updateServiceBadge
* @summary Updates the badge of a single service
* @description gets the name of a service and its current unread message count. Updates the badge of the related service
* @param serviceName - Name of the service
* @param count - Amount of unread messages
*/
function updateServiceBadge(serviceName, count)
{
    console.log("updateServiceBadge ::: Start");

    if(count === null)
    {
        return;
    }

    console.log("updateServiceBadge ::: New count for service _" + serviceName + "_ is: " + count);

    if(count === 0)
    {
        count = "";
    }

    // update the badge
    $( "#badge_" + serviceName).html( count );

    // Update tray icon status if needed
    updateTrayIconStatus();

    console.log("updateServiceBadge ::: End");
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
    console.log("readLocalStorage ::: key: _" + key + "_ - got value: _" + value +"_");
    console.log("readLocalStorage ::: End");
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
    console.log("writeLocalStorage ::: key: _" + key + "_ - new value: _" + value + "_");
    localStorage.setItem(key, value);
    console.log("writeLocalStorage ::: End");
}


/**
* @name openDevTools
* @summary Toggles DevConsole
* @description Opens or closes the Developer Console inside the app
*/
function openDevTools()
{
    console.log("openDevTools ::: Start");
    console.log("openDevTools ::: Opening Developer Console");
    const remote = require("electron").remote;
    remote.getCurrentWindow().toggleDevTools();
    console.log("openDevTools ::: End");
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
    console.log("settingToggleAutostart ::: Start");

    // auto-launch - via: https://www.npmjs.com/package/auto-launch
    var AutoLaunch = require("auto-launch");

    var ttthAutoLauncher = new AutoLaunch({
        name: "ttth",
        useLaunchAgent: true,
    });


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


    console.log("settingToggleAutostart ::: End");
}


/**
* @name settingToggleAutostartMinimized
* @summary Enables or disables the autostart minimized
* @description Enables or disables the autostart minimized
*/
function settingToggleAutostartMinimized()
{
    console.log("settingToggleAutostartMinimized ::: Start");

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
        // make sure check checkfor for general Autostart is checked as well
        // FIXME: nonext line is not working so far
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

    console.log("settingToggleAutostartMinimized ::: End");
}


/**
* @name settingDefaultViewUpdate
* @summary Stores a new default view to local storage
* @description Users can define a default / startup view in settings. This method stores the users choice into local storage.
*/
function settingDefaultViewUpdate()
{
    console.log("settingDefaultViewUpdate ::: Start");

    // get currently selected value from select
    var newDefaultView = $( "#selectDefaultView" ).val();
    console.log("settingDefaultViewUpdate ::: New default view on start is set to: " + newDefaultView);

    // Store new default view in local storage
    writeLocalStorage("settingDefaultView", newDefaultView);

    // send notification
    sendNotification("Settings", "Default view is now configured to load " + newDefaultView + " on startup.");

    console.log("settingDefaultViewUpdate ::: End");
}


/**
* @name settingDefaultViewReset
* @summary Reset the stored default view
* @description Deletes the localstorage key 'settingDefaultview'
*/
function settingDefaultViewReset()
{
    console.log("settingDefaultViewReset ::: Start");

    // delete local storage key and its related value
    localStorage.removeItem("settingDefaultView");

    // reset the selection of the select item
    $("#selectDefaultView").prop("selectedIndex",0);

    // send notification
    sendNotification("Settings", "Default view on startup is now set back to defaults (Settings).");

    console.log("settingDefaultViewReset ::: Start");
}


/**
* @name settingToggleMenubarVisibility
* @summary Toggles the setting hideMenubar
* @description Enabled or disables the srtting Hide-Menubar-On-Startup
*/
function settingToggleMenubarVisibility()
{
    console.log("settingToggleMenubarVisibility ::: Start");

    if($("#checkboxSettingHideMenubar").prop("checked"))
    {
        writeLocalStorage("settingHideMenubar", true);

        // send notification
        sendNotification("Settings", "Hide menubar on startup is now enabled (Settings).");
    }
    else
    {
        writeLocalStorage("settingHideMenubar", false);

        // send notification
        sendNotification("Settings", "Hide menubar on startup is now disabled (Settings).");
    }

    console.log("settingToggleMenubarVisibility ::: End");
}


/**
* @name checkSupportedOperatingSystem
* @summary Checks if the operating system is supported or not
* @description Checks if the operating system is linux. Everything else is untested so far.
*/
function checkSupportedOperatingSystem()
{
    console.log("checkSupportedOperatingSystem ::: Start");

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

    console.log("checkSupportedOperatingSystem ::: End");
}


/**
* @name switchToService
* @summary Activates a given service tab
* @description Activates the tab of a given service. Needed for handling DefaultView setting.
* @param serviceName - Name of the service
*/
function switchToService(serviceName)
{
    console.log("switchToService ::: Start");
    console.log("switchToService ::: Switching to tab: " + serviceName);

    // activate the related tab
    $("#target_" + serviceName).trigger("click");

    console.log("switchToService ::: End");
}


/**
* @name searchUpdate
* @summary Checks if there is a new release available
* @description Compares the local app version number with the tag of the latest github release. Displays a notification in the settings window if an update is available.
*/
function searchUpdate()
{
    console.log("searchUpdate ::: Start");

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
            sendNotification("Update available", "Version " + remoteAppVersionLatest + " is now available.");
        }
        else
        {
            console.log("searchUpdate ::: No newer version found.");

            // hide update information
            $("#updateInformation").hide();
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

    console.log("searchUpdate ::: End");
}


/**
* @name hideUpdateInformation
* @summary Hides the update information
* @description Hides the info div which shows hint regarding available update, link to changelog and link to release/download
*/
function hideUpdateInformation()
{
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
    console.log("validateConfiguredDefaultView ::: Start");

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

    console.log("validateConfiguredDefaultView ::: End");
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

    console.log("loadDefaultView ::: End");
}


/**
* @name openURL
* @summary Opens an url in browser
* @description Opens a given url in default browser
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
* @name loadServiceSpecificCode
* @summary Executes service specific javascript code on service-activation
* @description Executes service specific javascript code on service-activation
* @param serviceName - Name of the service
*/
function loadServiceSpecificCode(serviceName)
{
    console.log("loadServiceSpecificCode ::: Start");

    console.log("loadServiceSpecificCode ::: Checking for service-specific code for the service: " + serviceName);

    switch (serviceName)
    {
        case "Freenode":
            console.log("loadServiceSpecificCode ::: Executing " + serviceName + " specific things");
            serviceFreenodeAddEventListener();
            break;

        case "GoogleMail":
            console.log("loadServiceSpecificCode ::: Executing " + serviceName + " specific things");
            serviceGoogleMailAddEventListener();
            break;

        case "GoogleMessages":
            console.log("loadServiceSpecificCode ::: Executing " + serviceName + " specific things");
            serviceGoogleMessagesAddEventListener();
            break;

        case "Mattermost":
            console.log("loadServiceSpecificCode ::: Executing " + serviceName + " specific things");
            serviceMattermostAddEventListener();
            break;

         case "Slack":
            console.log("loadServiceSpecificCode ::: Executing " + serviceName + " specific things");
            serviceSlackAddEventListener();
            break;

        case "Telegram":
            console.log("loadServiceSpecificCode ::: Executing " + serviceName + " specific things");
            serviceTelegramAddEventListener();
            break;

        case "Threema":
            console.log("loadServiceSpecificCode ::: Executing " + serviceName + " specific things");
            serviceThreemaAddEventListener();
            break;

        case "WhatsApp":
            console.log("loadServiceSpecificCode ::: Executing " + serviceName + " specific things");
            serviceWhatsAppRegister();
            serviceWhatsAppAddEventListener();
            break;

        case "Xing":
            console.log("loadServiceSpecificCode ::: Executing " + serviceName + " specific things");
            serviceXingAddEventListener();
            break;

        default:
            console.log("loadServiceSpecificCode ::: Nothing to do here");
    }

    console.log("loadServiceSpecificCode ::: End");
}



/**
* @name initMattermost
* @summary checks if local storage contains a custom mattermost url
* @description Checks if custom mattermost url is stored in local storage. If not a prompt appears where the user can define the target url.
*/
function initMattermost()
{
    console.log("initMattermost ::: Start");

    // check if there is a url specificed in local storage
    var mattermostUrl = readLocalStorage("serviceMattermostUrl");
    if( (mattermostUrl === "") || (mattermostUrl === null) )
    {
        console.warn("initMattermost ::: Custom Mattermost URL is not yet defined.");

        const prompt = require("electron-prompt");

        prompt({
            title: "Mattermost url",
            label: "Please insert your mattermost <b>server URL</b>.",
            useHtmlLabel: true,
            resizable: false,
            value: "https://mattermost.example.org",
            inputAttrs: {
                type: "url"
            },
            icon: "../img/icon/icon.png"
        })
        .then((r) => {
            if(r === null) {
                console.log("initMattermost ::: User cancelled the URL dialog.");

                // hide tab
                $("#menu_Mattermost").hide();

                // uncheck service checkbox
                $("#checkbox_Mattermost").prop("checked", false);

                // set service mattermost to false
                writeLocalStorage("Mattermost", "false");
            }
            else
            {
                // TODO: check if url is reachable

                console.log("result", r);
                mattermostUrl = r;

                // update title property of service
                $("#label_Mattermost").prop("title", mattermostUrl);

                // Save value to local storage
                writeLocalStorage("serviceMattermostUrl", mattermostUrl);

                console.log("initMattermost ::: Custom Mattermost URL is now set to: " + mattermostUrl + ". Stored value in local storage");
            }
        })
        .catch(console.error);
    }
    else
    {
        // set src of mattermost webview
        document.getElementById( "MattermostWebview" ).setAttribute( "src", mattermostUrl);

        // adjust title
        $("#label_Mattermost").prop("title", mattermostUrl);
    }

    console.log("initMattermost ::: End");
}



/**
* @name initSlack
* @summary checks if local storage contains a slack workspacename
* @description Checks if custom workspacename  is stored in local storage. If not a prompt appears where the user can define the workspacename.
*/
function initSlack()
{
    console.log("initSlack ::: Start");

    // check if there is a url specificed in local storage
    var slackWorkspace = readLocalStorage("serviceSlackWorkspace");
    if( (slackWorkspace === "") || (slackWorkspace === null) )
    {
        console.warn("initSlack ::: Custom Slack Workspace is not yet defined.");

        const prompt = require("electron-prompt");

        prompt({
            title: "Slack Workspace name",
            label: "Please insert your Slack workspace name",
            value: "WORKSPACENAME",
            inputAttrs: {
                type: "text"
            },
            icon: "img/icon/icon.png"
        })
        .then((r) => {
            if(r === null) {
                console.log("initSlack ::: User cancelled the URL dialog.");

                // hide tab
                $("#menu_slack").hide();

                // uncheck service checkbox
                $("#Slack").prop("checked", false);

                // set service slack to false
                writeLocalStorage("Slack", "false");
            }
            else
            {
                // TODO: check if url is reachable

                console.log("result", r);
                slackWorkspace = r;

                // update title property of service
                $("#label_Slack").prop("title", "https://" + slackWorkspace + ".slack.com");

                // Save value to local storage
                writeLocalStorage("serviceSlackWorkspace", slackWorkspace);

                console.log("initSlack ::: Custom Slack Workspace is now set to: " + slackWorkspace + ". Stored value in local storage");
            }
        })
        .catch(console.error);
    }
    else
    {
        // set src of mattermost webview
        document.getElementById( "SlackWebview" ).setAttribute( "src", slackWorkspace);

        // adjust title
        $("#label_Slack").prop("title", slackWorkspace);
    }

    console.log("initSlack ::: End");
}



/**
* @name settingsToggleSingleServiceCheckbox
* @summary Triggered on click on a service checkbox on settings page
* @description Checks which service was clicked and hides or unihdes the related menu items. Writes to local stoage in addition
* @param objectName - Name of the checkbox
*/
function settingsToggleSingleServiceCheckbox(objectName)
{
    console.log("settingsToggleSingleServiceCheckbox ::: Start");

    // check if objectName is a valid service name
    // if so it should exists in the array: ttthAvailableServices
    var arrayPosition = ttthAvailableServices.indexOf(objectName);
    var objectNameIsValid = (ttthAvailableServices.indexOf(objectName) > -1);
    var curServiceUrl = ttthServicesUrls[arrayPosition];

    if(objectNameIsValid === true)
    {
        if($("#checkbox_" + objectName).prop("checked"))
        {
            console.log("settingsToggleSingleServiceCheckbox ::: Activating " + objectName);

            // write to local storage
            writeLocalStorage(objectName, "true");

            // show service in menu
            $("#menu_"+objectName).show();

            // add option to DefaultView select
            $("#selectDefaultView").append(new Option(objectName, objectName));

            // update status button
            $("#bt_" + objectName).attr("class", "btn btn-success btn-sm");
            $("#bt_" + objectName).attr("title", "enabled");

            // update webview src
            document.getElementById( objectName + "Webview" ).setAttribute( "src", curServiceUrl);
            console.log("settingsToggleSingleServiceCheckbox ::: webview src of service: " + objectName + " is now: " + curServiceUrl);

            // check if there is service-specific code to load
            loadServiceSpecificCode(objectName);

            // send notification
            sendNotification("Services", "Activated the service " + objectName + ".");

            // Hackery: Mattermost is different - as it has a user-specific URL
            //
            if( objectName === "Mattermost" )
            {
                initMattermost();
            }

            // Hackery: Slack is different - as it has a user-specific Workspace
            //
            if( objectName === "Slack" )
            {
                initSlack();
            }
        }
        else
        {
            console.log("settingsToggleSingleServiceCheckbox ::: Deactivating " + objectName);

            // write to local storage
            writeLocalStorage(objectName, "false");

            // hide service from menu
            $("#menu_"+objectName).hide();

            // update select
            $("#selectDefaultView option").each(function()
            {
                if (this.value === objectName)
                {
                    console.log("settingsToggleSingleServiceCheckbox ::: Deleting item from select");
                    this.remove();
                }
            });

            // update status button
            $("#bt_" + objectName).attr("class", "btn btn-danger btn-sm");
            $("#bt_" + objectName).attr("title", "disabled");

            // update webview src
            document.getElementById( objectName + "Webview" ).setAttribute( "src", "");
            console.log("settingsToggleSingleServiceCheckbox ::: webview src of service: " + objectName + " is now empty");

            // send notification
            sendNotification("Services", "Deactivated the service " + objectName + ".");

            // Hackery: Mattermost is different - as it has a user-specific URL
            //
            if( objectName === "Mattermost" )
            {
                // delete local storage key and its related value
                localStorage.removeItem("serviceMattermostUrl");

                // adjust service label back to default
                $("#label_Mattermost").prop("title", "");

            }

            // Hackery: Slack is different - as it has a user-specific workspace
            //
            if( objectName === "Slack" )
            {
                // delete local storage key and its related value
                localStorage.removeItem("serviceSlackWorkspace");

                // adjust service label back to default
                $("#label_Slack").prop("title", "");

            }
        }

        validateConfiguredDefaultView();

    }
    else
    {
        console.warn("settingsToggleSingleServiceCheckbox ::: Got an invalid objectName: " + objectName);
    }

    console.log("settingsToggleSingleServiceCheckbox ::: End");
}


/**
* @name initSettingsPage
* @summary Initializes the settings page
* @description Shows links to github informations. update informations. Initializes the service-checkboxes on loading the view
*/
function initSettingsPage()
{
    console.log("initSettingsPage ::: Start");

    // get appname and version
    //var appVersion = require("electron").remote.app.getVersion();
    //var appName = require("electron").remote.app.getName();

    var serviceName;
    var serviceUrl;
    var curSettingAutostart;
    var curSettingAutostartMinimized;
    var curSettingHideMenubar;

    // show appname and version
    //$( "#settingsAppVersion" ).html( appVersion );

    // loop over array ttthAvailableServices which contains all service-names
    //
    console.log("initSettingsPage ::: Start to load all services and its status to the settings interface");
    var arrayLength = ttthAvailableServices.length;
    for (var i = 0; i < arrayLength; i++)
    {
        serviceName =  ttthAvailableServices[i];
        serviceUrl = ttthServicesUrls[i];


        // Adding all services to settings page
        //
        // since 1.2.0
        if (i%2 === 0) // Odd and Even
        {
            // create a new row
            $( "#settingsAvailableServices" ).append('<div class="row" id=' + i + '></div>');

            // add something to this new row
            //$( "#" + i ).append('<div class="col-sm-6"><div class="input-group input-group-sm mb-1"><div class="input-group-prepend"><div class="input-group-text"><input type="checkbox" id='+ serviceName + ' name=' + serviceName + ' onClick="settingsToggleSingleServiceCheckbox(\''  + serviceName + '\');"></div></div><input type="text" class="form-control" id="label_' + serviceName + '" aria-label="Text input with checkbox" value='+ serviceName +' title=' + serviceUrl + ' disabled><div class="input-group-prepend"><button type="button" class="btn btn-danger btn-sm" id="bt_'+ serviceName +'" title="disabled" disabled></button></div></div></div>');
            $( "#" + i ).append('<div class="col-sm-6"><div class="input-group input-group-sm mb-1"><div class="input-group-prepend"><div class="input-group-text"><input type="checkbox" id="checkbox_'+ serviceName + '" name=' + serviceName + ' onClick="settingsToggleSingleServiceCheckbox(\''  + serviceName + '\');"></div></div><input type="text" class="form-control" id="label_' + serviceName + '" aria-label="Text input with checkbox" value='+ serviceName +' title=' + serviceUrl + ' disabled><div class="input-group-prepend"><button type="button" class="btn btn-danger btn-sm" id="bt_'+ serviceName +'" title="disabled" disabled></button></div></div></div>');
        }
        else
        {
            // add something to the existing row
            var rowReference = i -1;
            $( "#" + rowReference  ).append('<div class="col-sm-6"><div class="input-group input-group-sm mb-1"><div class="input-group-prepend"><div class="input-group-text"><input type="checkbox" id="checkbox_' + serviceName + '" name=' + serviceName + ' onClick="settingsToggleSingleServiceCheckbox(\''  + serviceName + '\');"></div></div><input type="text" class="form-control" id="label_' + serviceName + '" aria-label="Text input with checkbox" value='+ serviceName +' title=' + serviceUrl + ' disabled><div class="input-group-prepend"><button type="button" class="btn btn-danger btn-sm" id="bt_'+ serviceName +'" title="disabled" disabled></button></div></div></div>');
        }


        // until: 1.2.0:
        //
        //$( "#settingsAvailableServices" ).append('<div class="input-group input-group-sm mb-1"><div class="input-group-prepend"><div class="input-group-text"><input type="checkbox" id=' + serviceName + ' name=' + serviceName + ' onClick="settingsToggleSingleServiceCheckbox(\''  + serviceName + '\');"></div></div><input type="text" class="form-control" id="label_' + serviceName + '" aria-label="Text input with checkbox" value='+ serviceName +' title=' + serviceUrl + ' disabled><div class="input-group-prepend"><button type="button" class="btn btn-danger btn-sm" id="bt_'+ serviceName +'" title="disabled" disabled></button></div></div>');


        // Show activated services as enabled in settings
        // add them to the default view select item
        // and update the related status button
        console.log("initSettingsPage ::: Checking status of service: " + serviceName);
        var curServiceStatus = readLocalStorage(serviceName);
        if(curServiceStatus === "true")
        {
            console.log("initSettingsPage ::: Service: " + serviceName + " is activated");

            // check the checkbox
            $("#checkbox_" + serviceName).prop("checked", true);

            // add to defaultView select item
            $("#selectDefaultView").append(new Option(serviceName, serviceName));

            // update status button
            $("#bt_" + serviceName).attr("class", "btn btn-success btn-sm");
            $("#bt_" + serviceName).attr("title", "enabled");

            // set webview src
            document.getElementById( serviceName + "Webview" ).setAttribute( "src", ttthServicesUrls[i]);
            console.log("initSettingsPage ::: webview src of service: " + serviceName + " is now: " + ttthServicesUrls[i]);

            // check if there is service-specific code to load
            loadServiceSpecificCode(serviceName);
        }
        else
        {
            console.log("initSettingsPage ::: Service: " + serviceName + " is deactivated");

            // set webview src
            document.getElementById( serviceName + "Webview" ).setAttribute( "src", "");
            console.log("initSettingsPage ::: webview src of service: " + serviceName + " is now empty.");
        }
    }

    // specialcase: Mattermost
    var mattermostEnabled = readLocalStorage("Mattermost");
    if(mattermostEnabled === "true")
    {
        initMattermost();
    }


    // specialcase: Mattermost
    var slackEnabled = readLocalStorage("Slack");
    if(slackEnabled === "true")
    {
        initSlack();
    }


    // Setting: DefaultView - now validate the optional configured default view
    validateConfiguredDefaultView();

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
        // baustelle
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

    console.log("initSettingsPage ::: End");
}


/**
* @name initNavigationTabs
* @summary Init the menu / navigation on app launch
* @description Checks which services are enabled and shows or hides the related tabs from navigation
*/
function initNavigationTabs()
{
    console.log("initNavigationTabs ::: Start");

    var serviceName;

    // loop over array ttthAvailableServices
    var arrayLength = ttthAvailableServices.length;
    for (var i = 0; i < arrayLength; i++)
    {
        serviceName = ttthAvailableServices[i];
        console.log("initNavigationTabs ::: Checking status of service: " + serviceName);

        var curServiceStatus = readLocalStorage(serviceName);

        if(curServiceStatus === "true")
        {
            console.log("initNavigationTabs ::: Activating " + serviceName );

            // show service-tab in navigation
            $("#menu_" + serviceName).show();
        }
        else
        {
            console.log("initNavigationTabs ::: Deactivating " + serviceName);

            // hide service-tab in navigation
            $("#menu_" + serviceName).hide();
        }
    }

    console.log("initNavigationTabs ::: End");
}


/**
* @name localizeUserInterface
* @summary Localizes the user interface
* @description Is using i18next to localize the user interface. Translations are located in app/locales
*/
function localizeUserInterface()
{
  console.log("localizeUserInterface ::: Start");

  var userLang = navigator.language || navigator.userLanguage;

  // for development screenshot - overwrite the language
  //userLang = "en";

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

  console.log("localizeUserInterface ::: End");
}



// Call from main.js
//
require("electron").ipcRenderer.on("reloadCurrentService", function(event, message)
{
    console.log("reloadCurrentService ::: Start");

    //console.log(message);  // Prints "whoooooooh!"

    // get href of current active tab
    var tabValue = $(".nav-tabs .active").attr("href");
    tabValue = tabValue.substring(1); // cut the first char ( =  #) 
    console.log("reloadCurrentService ::: Current active tab is: " + tabValue);


    
    var currentPositionInArray = null;
    var serviceName = null;
    var serviceUrl = null;

    // find service name and service url from array
    currentPositionInArray = ttthAvailableServices.indexOf(tabValue);

    // grab the related vars from the serviceList arrays
    serviceName = ttthAvailableServices[currentPositionInArray];
    serviceUrl = ttthServicesUrls[currentPositionInArray];

    // reload the service - see #9
    switch (serviceName)
    {
        case "Freenode":
            console.log("reloadCurrentService ::: Reloading the service: " + serviceName);
            serviceFreenodeInit(serviceName, serviceUrl);
            break;

        case "GitHub":
            console.log("reloadCurrentService ::: Reloading the service: " + serviceName);
            serviceGitHubInit(serviceName, serviceUrl);
            break;

        case "GoogleCalendar":
            console.log("reloadCurrentService ::: Reloading the service: " + serviceName);
            serviceGoogleCalendarInit(serviceName, serviceUrl);
            break;

        case "GoogleContacts":
            console.log("reloadCurrentService ::: Reloading the service: " + serviceName);
            serviceGoogleContactsInit(serviceName, serviceUrl);
            break;

        case "GoogleKeep":
            console.log("reloadCurrentService ::: Reloading the service: " + serviceName);
            serviceGoogleKeepInit(serviceName, serviceUrl);
            break;

        case "GoogleMail":
            console.log("reloadCurrentService ::: Reloading the service: " + serviceName);
            serviceGoogleMailInit(serviceName, serviceUrl);
            break;

        case "GoogleMessages":
            console.log("reloadCurrentService ::: Reloading the service: " + serviceName);
            serviceGoogleMessagesInit(serviceName, serviceUrl);
            break;

        case "GooglePhotos":
            console.log("reloadCurrentService ::: Reloading the service: " + serviceName);
            serviceGooglePhotosInit(serviceName, serviceUrl);
            break;

        case "Mattermost":
            console.log("reloadCurrentService ::: Reloading the service: " + serviceName);
            serviceMattermostInit(serviceName, serviceUrl);
            break;

        case "Slack":
            console.log("reloadCurrentService ::: Reloading the service: " + serviceName);
            serviceSlackInit(serviceName, serviceUrl);
            break;

        case "Telegram":
            console.log("reloadCurrentService ::: Reloading the service: " + serviceName);
            serviceTelegramInit(serviceName, serviceUrl);
            break;

        case "Threema":
            console.log("reloadCurrentService ::: Reloading the service: " + serviceName);
            serviceThreemaInit(serviceName, serviceUrl);
            break;

        case "Twitter":
            console.log("reloadCurrentService ::: Reloading the service: " + serviceName);
            serviceTwitterInit(serviceName, serviceUrl);
            break;

        case "WhatsApp":
            console.log("reloadCurrentService ::: Reloading the service: " + serviceName);
            serviceWhatsAppInit(serviceName, serviceUrl);
            break;

        case "Xing":
            console.log("reloadCurrentService ::: Reloading the service: " + serviceName);
            serviceXingInit(serviceName, serviceUrl);
            break;

        default:
            // do something
            break;
    }

    console.log("reloadCurrentService ::: Start");
});



// Call from main.js: switch to settings tab
//
require("electron").ipcRenderer.on("showSettings", function(event)
{
    console.log("showSettings ::: Start");

    switchToService("Settings");

    console.log("showSettings ::: End");
});



// Call from main.js: Start search for new updates
//
require("electron").ipcRenderer.on("startSearchUpdates", function(event)
{
    console.log("startSearchUpdates ::: Start");

    // show update information
    $("#updateInformation").show();

    searchUpdate();

    console.log("startSearchUpdates ::: End");
});




// Call from main.js: Switch to next tab
//
require("electron").ipcRenderer.on("nextTab", function(event)
{
    console.log("nextTab ::: Start");

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
            if(currentTabId !== "settings")
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

    console.log("nextTab ::: End");
});
