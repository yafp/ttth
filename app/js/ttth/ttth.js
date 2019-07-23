/**
* @name showNoty
* @summary Shows a noty notification
* @description Creates a notification using the noty framework
* @param type - Options: alert, success, warning, error, info/information
* @param message - notification text
* @param timeout - Timevalue, defines how long the message should be displayed. Use 0 for no-timeout
*/
function showNoty(type, message, timeout = 3000)
{
    //const Noty = require("noty");
    new Noty({
        type: type,
        timeout: timeout,
        theme: "bootstrap-v4",
        layout: "bottom",
        text: message,
    }).show();
}


/**
* @name writeLog
* @summary Writes a log message from renderer to log file and to cli and replaces the classic console-command which writes to dev-console.
* @description Writes a log message from renderer to log file and to cli
* @param logType - The type of log message. Supported are: error, warn. info. verbose. debug.  silly
* @param logMessage - The actual log message
*/
function writeLog(logType, logMessage)
{
    //const logR = require("electron-log"); // for logging to file

    // log to file
    //logR.transports.file.level = true;

    // log to console
    //logR.transports.console.level = false; // TODO: should depend on the verbose setting in main.js


    // add prefix for all logs from [R]enderer
    logMessage = "[R] " + logMessage;

    switch (logType)
    {
        case "error" :
            //logR.error(logMessage); //  to file
            console.error(logMessage); // to console
            break;

        case "warn" :
            //logR.warn(logMessage); // to file
            console.warn(logMessage); // to console
            break;

        case "info" :
            //logR.info(logMessage); // to file
            console.log(logMessage); // to console
            break;

        case "verbose" :
            //logR.verbose(logMessage); // to file
            break;

        case "debug" :
            //logR.debug(logMessage); // to file
            console.debug(logMessage); // to console
            break;

        case "silly" :
            //logR.silly(logMessage); // to file
            break;

      default:
         logR.info(logMessage); // to file
         console.log(logMessage);
   }
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
    writeLog("info", "readLocalStorage ::: key: _" + key + "_ - got value: _" + value +"_");
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
    writeLog("info", "writeLocalStorage ::: key: _" + key + "_ - new value: _" + value + "_");
    localStorage.setItem(key, value);
}


/**
* @name previewIcon
* @summary Generates a preview of the icon in the config-window
* @description Reads the content of the icon field and tries to show/preview the resulting FontAwesome icon
*/
function previewIcon()
{
    // get content of field
    var currentIconCode = $("#input_serviceIcon").val();

    // try to load font-awesome icon
    $("#previewIcon").html("<i class='" + currentIconCode + " fa-lg'></i>");
}


/**
* @name settingsSelectServiceToAddChanged
* @summary Changes the add-service-template was selected and enables the button
* @description Changes the add-service-template was selected and enables the button
*/
function settingsSelectServiceToAddChanged()
{
    var currentSelectedServiceTemplate = $("#select_availableServices").val();

    writeLog("info", "settingsSelectServiceToAddChanged ::: Value of service-template select has changed to: _" + currentSelectedServiceTemplate + "_.");

    if(currentSelectedServiceTemplate !== "")
    {
        // enable the add button
        $("#bt_addNewService").prop("disabled", false);

        // change button type to success
        $("#bt_addNewService").removeClass();
        $("#bt_addNewService").addClass("btn btn-success btn-sm");

        writeLog("info", "settingsSelectServiceToAddChanged ::: Enabled the add-service button.");
    }
    else // this code should never be triggered - might be deleteable.
    {
        // disable the add button
        $("#bt_addNewService").prop("disabled", true);

        // change button type to secondary
        // change button type to success
        $("#bt_addNewService").removeClass();
        $("#bt_addNewService").addClass("btn btn-secondary btn-sm");

        writeLog("info", "settingsSelectServiceToAddChanged ::: Disabled the add-service button.");
    }
}


/**
* @name showNotyAutostartMinimizedConfirm
* @summary Shows a dialog while configuring the autostart.
* @description Asks the user if the autostart should be minimized or not
*/
function showNotyAutostartMinimizedConfirm()
{
    var AutoLaunch = require("auto-launch");

    var n = new Noty(
    {
        theme: "bootstrap-v4",
        layout: "bottom",
        text: "Should autostart enable the minimize mode?",
        buttons: [
            Noty.button("Yes", "btn btn-success", function ()
            {
                // enable start minimized
                var ttthAutoLauncher = new AutoLaunch({
                    name: "ttth",
                    isHidden: true,
                    useLaunchAgent: true,
                });

                ttthAutoLauncher.enable();
                writeLocalStorage("settingAutostart", true);
                n.close();
                showNoty("success", "<i class='fas fa-toggle-on'></i> <b>Option:</b> <u>Minimized Autostart (on login)</u> is now enabled.");
            },
            {
                id: "button1", "data-status": "ok"
            }),

            Noty.button("No", "btn btn-secondary", function ()
            {
                var ttthAutoLauncher = new AutoLaunch({
                    name: "ttth",
                    isHidden: false,
                    useLaunchAgent: true,
                });

                ttthAutoLauncher.enable();
                writeLocalStorage("settingAutostart", true);
                n.close();
                showNoty("success", "<i class='fas fa-toggle-on'></i> <b>Option:</b> <u>Autostart (on login)</u> is now enabled.");
            })
        ]
    });

    // show the noty dialog
    n.show();
}


/**
* @name settingsAboutShowMore
* @summary Makes several buttons visible in the about section of the settings tab
* @description USed to keep the settings ui clean on-load, button show-more hides itself after being pressed and loads several other buttons
*/
function settingsAboutShowMore()
{
    $("#bt_aboutShowMore").hide();
}


/**
* @name openUserServicesConfigFolder
* @summary Opens the folder in filesystem which contains the service configurations of the current user
* @description Triggers a method in main.js which then opens the folder which contains all service configurations of the current user.
*/
function openUserServicesConfigFolder()
{
    const {ipcRenderer} = require("electron");
    ipcRenderer.send("openUserServicesConfigFolder");

    writeLog("info", "openUserServicesConfigFolder ::: Should try to open the folder which contains the user configured services.");
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
            currentTabId = currentTabId.replace("target_", "");

            writeLog("info", "updateTrayIconStatus ::: Check unread message badge of: _" + currentTabId + "_.");

            curServiceUnreadMessageCount = 0; // reset to 0
            curServiceUnreadMessageCount = $("#badge_" + currentTabId ).html();
            curServiceUnreadMessageCount = Number(curServiceUnreadMessageCount);

            // if the current service has a significant unread message count -> log it and add it to overall counter
            if( (curServiceUnreadMessageCount !== 0) && (curServiceUnreadMessageCount !== "") && (curServiceUnreadMessageCount !== null) )
            {
                writeLog("info", "updateTrayIconStatus ::: Unread messages count of service _" + serviceName + "_ is: " + curServiceUnreadMessageCount);

                // increate the overall counter
                overallUnreadMessages = overallUnreadMessages + curServiceUnreadMessageCount;
            }
        }
        else
        {
            //writeLog("info", "updateTrayIconStatus ::: Ignoring settings-tab - as it has no badge.");
        }
    });

    writeLog("info", "updateTrayIconStatus ::: Overall unread message count is: _" + overallUnreadMessages + "_.");

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
* @summary Updates the badge in a tab of a single service
* @description gets the name of a service and its current unread message count. Updates the badge of the related service
* @param serviceId - ID of the service
* @param count - Amount of unread messages
*/
function updateServiceBadge(serviceId, count)
{
    writeLog("info", "updateServiceBadge ::: New unread count for service _" + serviceId + "_ is: _" + count + "_.");

    // if count is < 1 - badge should show nothing
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
* @name eventListenerForSingleService
* @summary Adds several EventListeners to the webview of the service
* @description Defines several EventListeners to the webview of the service and starts a periodic request to check for unread messages
* @param serviceId - the ID of the service
* @param enableUnreadMessageHandling - boolean - if unread message handler should be created
* @param enableLinkSupport - boolean - if link handler should be created
*/
function eventListenerForSingleService(serviceId, enableUnreadMessageHandling = true, enableLinkSupport = false)
{
    writeLog("info", "eventListenerForSingleService ::: Start for service: _" + serviceId + "_.");
    writeLog("info", "eventListenerForSingleService ::: Adding event listeners for webview: _webview_" + serviceId + "_.");

    // get webview
    var webview = document.getElementById("webview_" + serviceId);

    // run it periodically
    //
    //  5.000 =  5 sec
    var intervalID = setInterval(function()
    {
        //writeLog("info", "EventListener of: " + serviceId);
        webview.send("request");
    }, 5000);


    // WebView Events for UnreadMessageHandling
    //
    if(enableUnreadMessageHandling === true)
    {
        // WebView Event: did-start-loading
        //
        webview.addEventListener("did-start-loading", function()
        {
            writeLog("info", "eventListenerForSingleService ::: did-start-loading.");

            // Triggering search for unread messages
            webview.send("request");
        });


        // WebView Event: dom-ready
        //
        webview.addEventListener("dom-ready", function()
        {
            writeLog("info", "eventListenerForSingleService ::: DOM-Ready");

            // Triggering search for unread messages
            webview.send("request");
        });


        // WebView Event: did-stop-loading
        //
        webview.addEventListener("did-stop-loading", function()
        {
            writeLog("info", "eventListenerForSingleService ::: did-stop-loading");

            // Debug: Open a separate Console Window for this WebView
            //webview.openDevTools();

            // Triggering search for unread messages
            webview.send("request");
        });


        // WebView Event:  ipc-message
        webview.addEventListener("ipc-message",function(event)
        {
            writeLog("info", "eventListenerForSingleService ::: ipc-message");
            //writeLog("info", event);
            //console.info(event.channel);

            // update the badge
            if(event.channel != null)
            {
                updateServiceBadge(serviceId, event.channel);
            }
        });
    }


    // WebView Event: new-window / clicking links
    //
    if(enableLinkSupport === true)
    {
        webview.addEventListener("new-window", function(e)
        {
            writeLog("info", "eventListenerForSingleService ::: new-window");

            const BrowserWindow = require("electron");
            const shell = require("electron").shell;
            const protocol = require("url").parse(e.url).protocol;

            if (protocol === "http:" || protocol === "https:")
            {
                shell.openExternal(e.url);
            }
        });
    }

    writeLog("info", "eventListenerForSingleService ::: End");
}


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


/**
* @name validateConfigSingleServiceForm
* @summary Validate the required input values from the config-single-service form
* @description Validate the required input values from the config-single-service form
* @param serviceName - The display name of the service
* @param serviceIcon - The icon for this service
* @param serviceUrl - The url of this service
* @return true or false - depending on the actual form validation
*/
function validateConfigSingleServiceForm(serviceName, serviceIcon, serviceUrl)
{
    writeLog("info", "validateConfigSingleServiceForm ::: Starting to validate the form.");

    if ((serviceName === "") || (serviceIcon === "") || (serviceUrl === ""))
    {
        writeLog("warn", "validateConfigSingleServiceForm ::: Form is not valid.");
        return false;
    }
    else
    {
        writeLog("info", "validateConfigSingleServiceForm ::: Form is valid.");
        return true;
    }
}


/**
* @name createSingleServiceConfiguration
* @summary Fetches the input values from the single-service-configuration popup window and creates a related service config
* @description Fetches the input values from the single-service-configuration popup window and creates a related service config
*/
function createSingleServiceConfiguration()
{
    writeLog("info", "updateSingleServiceConfiguration ::: Starting to create  a new service config");

    const storage = require("electron-json-storage");

    // get values from configServiceWindow
    var serviceId = $("#input_serviceId").val();
    var serviceType = $("#input_serviceType").val(); // hidden
    var serviceName = $("#input_serviceName").val();
    var serviceIcon = $("#input_serviceIcon").val();
    var serviceUrl = $("#input_serviceUrl").val();
    var serviceInjectCode = $("#input_serviceInjectCode").val(); //hidden
    var serviceEnableStatus = true;

    var isFormValid = validateConfigSingleServiceForm(serviceName, serviceIcon, serviceUrl);
    if (isFormValid === true)
    {
        // create a new config for the configured service
        storage.set(serviceId, {
            "type": serviceType,
            "name": serviceName,
            "icon": serviceIcon,
            "url": serviceUrl,
            "injectCode": serviceInjectCode,
            serviceEnableStatus: serviceEnableStatus
        },
        function(error)
        {
            // reload the main window
            const {ipcRenderer} = require("electron");
            ipcRenderer.send("reloadMainWindow");

            closeSingleServiceConfiguratationWindow();

            writeLog("info", "createSingleServiceConfiguration ::: Created a new service config for: _" + serviceId + "_.");

            showNoty("success", "Successfully created the new service: " + serviceId);

            if (error)
            {
                throw error;
            }
        });
    }
}


/**
* @name updateSingleServiceConfiguration
* @summary Fetches the input values from the single-service-configuration popup window and updates the related service config
* @description Fetches the input values from the single-service-configuration popup window and updates the related service config
*/
function updateSingleServiceConfiguration()
{
    writeLog("info", "updateSingleServiceConfiguration ::: Starting to update an existing service config");

    const storage = require("electron-json-storage");

    // get values from configServiceWindow
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
    else
    {
        serviceEnableStatus = false;
    }

    var isFormValid = validateConfigSingleServiceForm(serviceName, serviceIcon, serviceUrl);
    if (isFormValid === true)
    {
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
            // reload the main window
            const {ipcRenderer} = require("electron");
            ipcRenderer.send("reloadMainWindow");

            closeSingleServiceConfiguratationWindow();

            writeLog("info", "updateSingleServiceConfiguration ::: Updating service config: _" + serviceId + "_.");

            showNoty("success", "Successfully edited the existing service: " + serviceId);

            if (error)
            {
                throw error;
            }
        });
    }
}


/**
* @name configureSingleUserService
* @summary Triggers a function in main.js to  open the single-service-configuration popup window
* @description Triggers a function in main.js to  open the single-service-configuration popup window
* @param serviceId - id of the service
*/
function configureSingleUserService(serviceId)
{
    writeLog("info", "configureSingleUserService ::: Trying to open service configure window for service: _" + serviceId + "_.");

    // send ipc to show second window
    const {ipcRenderer} = require("electron");
    ipcRenderer.send("showConfigureSingleServiceWindow", serviceId);
}


/**
* @name updateMainWindowTitle
* @summary Triggers an update title function in main.js
* @description Triggers an update title function in main.js. This is needed to update the app window title to display the current / frontmost service.
* @param TabName - Name of the current tab
*/
function updateMainWindowTitle(tabName)
{
    writeLog("info", "updateMainWindowTitle ::: Sending _" + tabName + "_ to main.js");

    const {ipcRenderer} = require("electron");
    ipcRenderer.send("updateMainWindowTitle", tabName);
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
    writeLog("info", "isMac ::: Detected operating system type is: " + os.type());
    if(os.type() === "Darwin")
    {
        writeLog("info", "isMac ::: Smelling apples");
        return true;
    }
    else
    {
        writeLog("info", "isMac ::: This is no mac");
        return false;
    }
}


/**
* @name openDevTools
* @summary Toggles DevConsole
* @description Opens or closes the Developer Console inside the app
*/
function openDevTools()
{
    writeLog("info", "openDevTools ::: Opening Developer Console");
    const remote = require("electron").remote;
    remote.getCurrentWindow().toggleDevTools();
}


/**
* @name sendNotification
* @summary Send a notification
* @description Creates a desktop notification
* @param title- Title string for the notification
* @param message - Message string for the notification
*/
function sendNotification(title, message)
{
    writeLog("info", "sendNotification ::: Sending a notification with the title _" + title + "_ and the message: _" + message + "_.");

    let myNotification = new Notification(title, {
        body: message,
        icon: "img/notification/icon_notification.png"
    });
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
        showNotyAutostartMinimizedConfirm();
    }
    else
    {
        ttthAutoLauncher.disable();

        writeLocalStorage("settingAutostart", false);

        writeLog("info", "settingToggleAutostart ::: Finished disabling Autostart");

        showNoty("success", "<i class='fas fa-toggle-off'></i> <b>Option:</b> <u>Autostart (on login)</u> is now disabled.");
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
* @name settingDefaultViewUpdate
* @summary Stores a new default view to local storage
* @description Users can define a default / startup view in settings. This method stores the users choice into local storage.
*/
function settingDefaultViewUpdate()
{
    // get currently selected value from select
    var newDefaultView = $( "#selectDefaultView" ).val();
    writeLog("info", "settingDefaultViewUpdate ::: New default view on start is set to: " + newDefaultView);

    // Store new default view in local storage
    writeLocalStorage("settingDefaultView", newDefaultView);

    // show noty
    showNoty("success", "Set default view to " + newDefaultView);
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

    writeLog("info", "settingDefaultViewReset ::: Did reset the default view");

    // show noty
    showNoty("success", "Resetted default view.");
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

        writeLog("info", "settingToggleMenubarVisibility ::: Hide menubar is enabled");

        // show noty
        showNoty("success", "<i class='fas fa-toggle-on'></i> <b>Option:</b> <u>Hide menubar (on load)</u> is now enabled.");
    }
    else
    {
        writeLocalStorage("settingHideMenubar", false);

        writeLog("info", "settingToggleMenubarVisibility ::: Hide menubar is disabled");

        // show noty
        showNoty("success", "<i class='fas fa-toggle-off'></i> <b>Option:</b> <u>Hide menubar (on load)</u> is now disabled.");
    }
}


/**
* @name checkSupportedOperatingSystem
* @summary Checks if the operating system is supported or not
* @description Checks if the operating system is linux, windows or macOS. Those are supported - others are currently not.
*/
function checkSupportedOperatingSystem()
{
    var supportedOperatingSystemMessage = "";
    var userPlatform = process.platform;

    writeLog("info", "checkSupportedOperatingSystem ::: Detected operating system as: " + userPlatform);

    switch(userPlatform)
    {
        case "win32":
        case "windows":
        case "linux":
        case "darwin":
            writeLog("info", "checkSupportedOperatingSystem ::: Operating system " + userPlatform + " is fine." );
            break;

        default:
            // define message
            supportedOperatingSystemMessage = userPlatform + " is currently not supported. Please contact devs.";

            showNoty("warning", supportedOperatingSystemMessage, 0);

            writeLog("error", "checkSupportedOperatingSystem ::: " + supportedOperatingSystemMessage );
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
    writeLog("info", "switchToService ::: Switching to tab: " + serviceName);

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
    //const semver = require('semver')

    var remoteAppVersionLatest = "0.0.0";
    var localAppVersion = "0.0.0";
    var versions;

    var gitHubPath = "yafp/ttth";  // user/repo
    var url = "https://api.github.com/repos/" + gitHubPath + "/tags";

    writeLog("info", "searchUpdate ::: Start checking " + url + " for available releases");

    var updateStatus = $.get( url, function( data )
    {
        timeout:3000; // in milliseconds

        // success
        versions = data.sort(function (v1, v2)
        {
            //return semver.compare(v2.name, v1.name);
        });

        // get remote version
        //
        remoteAppVersionLatest = versions[0].name;
        //remoteAppVersionLatest = "66.1.2"; // overwrite variable to simulate available updates

        // get local version
        //
        localAppVersion = require("electron").remote.app.getVersion();
        //localAppVersion = "1.0.0"; // to simulate

        writeLog("info", "searchUpdate ::: Local version: " + localAppVersion);
        writeLog("info", "searchUpdate ::: Latest public version: " + remoteAppVersionLatest);

        if( localAppVersion < remoteAppVersionLatest ) // Update available
        {
            writeLog("warn", "searchUpdate ::: Found update, notify user");

            // send notification
            showNoty("success", "An update to version " + remoteAppVersionLatest + " is now available for <a href='https://github.com/yafp/ttth/releases' target='new'>download</a>.", 0);
        }
        else // No update available
        {
            writeLog("info", "searchUpdate ::: No newer version found.");

            if(silent === false) // when executed manually via menu -> user should see result of this search
            {
                showNoty("success", "No updates available");
            }
        }

        writeLog("info", "searchUpdate ::: Successfully checked " + url + " for available releases");
    })
    .done(function()
    {
        //writeLog("info", "searchUpdate ::: Successfully checked " + url + " for available releases");
    })

    .fail(function()
    {
        writeLog("error", "searchUpdate ::: Checking " + url + " for available releases failed.");

        showNoty("error", "Checking " + url + " for available releases failed. Got network issues?");
    })

    .always(function()
    {
        writeLog("info", "searchUpdate ::: Finished checking " + url + " for available releases");
    });
}


/**
* @name loadDefaultView
* @summary Loads the default view
* @description Loads the default view. This is used on load of the .html
*/
function loadDefaultView()
{
    // read from local storage
    var curDefaultView = readLocalStorage("settingDefaultView");

    if(curDefaultView === null) // no default view configured
    {
        writeLog("info", "loadDefaultView ::: No default configured");
    }
    else
    {
        writeLog("info", "loadDefaultView ::: Found configured default view: " + curDefaultView);
        switchToService(curDefaultView);
    }
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
        writeLog("info", "validateConfiguredDefaultView ::: No default configured - Stay on settings-view");
    }
    else
    {
        writeLog("info", "validateConfiguredDefaultView ::: Found configured default view: " + curDefaultView);

        // check if the configured service is enabled or not
        writeLog("info", "validateConfiguredDefaultView ::: Check if configured default view is an enabled service or not");

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
            writeLog("info", "validateConfiguredDefaultView ::: Configured default view is valid");

            // Update select
            $("#selectDefaultView").val(curDefaultView);

            // load the default view
            loadDefaultView();
        }
        else
        {
            writeLog("info", "validateConfiguredDefaultView ::: Fallback to default (setting-view)");

            // reset the selection of the select item
            $("#selectDefaultView").prop("selectedIndex",0);

            // delete the localstorage entry for defaultview
            settingDefaultViewReset();
        }
    }
}


/**
* @name openURL
* @summary Opens an url in browser
* @description Opens a given url in default browser. This is pretty slow, but got no better solution so far.
* @param url - URL string which contains the target url
*/
function openURL(url)
{
    const {shell} = require("electron");
    writeLog("info", "openURL ::: Trying to open the url: " + url);
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
    writeLog("info", "loadServiceSpecificCode ::: Checking for service-specific code for the service: " + serviceName + " with the id: _" + serviceId + "_.");

    switch (serviceName)
    {
        // NO unread message handler and NO Link handler
        //

        // NO unread-message-handling but link-handler
        case "freenode":
        case "linkedIn":
        case "messenger":
            writeLog("info", "loadServiceSpecificCode ::: Executing " + serviceName + " specific things");
            eventListenerForSingleService(serviceId, false, true);
            break;

        // Unread-message-handler but NO link handler
        case "threema":
        case "twitter":
        case "xing":
            writeLog("info", "loadServiceSpecificCode ::: Executing " + serviceName + " specific things");
            eventListenerForSingleService(serviceId, true, false);
            break;

        // Unread-message-handler and link-handler
        case "googleMail":
        case "googleMessages":
        case "mattermost":
        case "slack":
        case "telegram":
            writeLog("info", "loadServiceSpecificCode ::: Executing " + serviceName + " specific things");
            eventListenerForSingleService(serviceId, true, true);
            break;

        // Specialcase: WhatsApp
        case "whatsapp":
            writeLog("info", "loadServiceSpecificCode ::: Executing " + serviceName + " specific things");
            serviceWhatsAppRegister();
            eventListenerForSingleService(serviceId, true, true);
            break;

        default:
            //writeLog("info", "loadServiceSpecificCode ::: Nothing to do here");
    }
}


/**
* @name initAvailableServicesSelection
* @summary fills the select item in settings-page (which features all supported services)
* @description fills the select item in settings-page (which features all supported services). Source is services.json
*/
function initAvailableServicesSelection()
{
    writeLog("info", "initAvailableServicesSelection ::: Reload settings select with all supported service definitions");

    var counterSupportedServices = 0;

    // get reference to select which contains all supported service type definitions
    let dropdown = $("#select_availableServices");

    // Empty the select
    //dropdown.empty();

    // Add a disabled dummy/default entry
    //dropdown.append("<option selected='true' disabled>Choose a service</option>");

    // select the first entry
    dropdown.prop("selectedIndex", 0);

    // url to service definitions
    const url = __dirname + "/js/ttth/services.json";

    // Populate select with list of provinces
    $.getJSON(url, function (data)
    {
        $.each(data, function (key, entry)
        {
            // add option to select
            dropdown.append($("<option></option>").attr("value", entry.id).text(entry.nameLong));

            // count services
            counterSupportedServices = counterSupportedServices +1;
        });

        writeLog("info", "initAvailableServicesSelection ::: Finished reloading settings select with all supported service definitions. Found _" + counterSupportedServices + "_ service types.");
    });
}


/**
* @name loadConfiguredUserServices
* @summary loads all the configured-user-services to the configured-services-section of the settings tab.
* @description removes all configured user services from settings view, reads all configured user services and re-adds them to the settings ui under 'Configured services'
*/
function loadConfiguredUserServices()
{
    const storage = require("electron-json-storage");

    // empty the div
    $( "#settingsServicesConfigured" ).empty();

    // read all user service files
    storage.getAll(function(error, data)
    {
        if (error)
        {
            throw error;
        }

        // show object which contains all config files
        //writeLog("error", (data);
        //writeLog("error", (typeof data);

        var serviceCount = 0;

        writeLog("info", "loadConfiguredUserServices ::: Found the following user configs: _" + data + "_.");

        // loop over upper object
        for (var key in data)
        {
            if (data.hasOwnProperty(key))
            {
                writeLog("info", "loadConfiguredUserServices ::: " + key + " -> " + data[key]);

                // show 2 services per row
                if (serviceCount%2 === 0) // Odd
                {
                    // create a new row
                    $( "#settingsServicesConfigured" ).append("<div class='row ttthServiceRow' id='conf_" + serviceCount + "'></div>");

                    if(data[key]["serviceEnableStatus"] === true) // show enabled configured service
                    {
                        $( "#conf_" + serviceCount ).append('<div class="col-sm-6"><div class="input-group input-group-sm mb-1"><div class="input-group-prepend"><div class="input-group-text"><i title="' + data[key]["type"] + '" class="' + data[key]["icon"] +'"></i></div></div><input type="text" class="form-control" id="label_' + data[key]["url"] + '" aria-label="Text input with checkbox" value='+ data[key]["name"] + ' title=' + data[key]["url"] + ' disabled><div class="input-group-prepend"><button type="button" id="bt_configSingleService_'+ key +'" title="configure" class="btn btn-dark" onClick="configureSingleUserService(\''  + key + '\')"><i class="fas fa-cog"></i></button><button type="button" class="btn btn-success btn-sm" id="bt_'+ key +'" title="enabled" onClick="settingsToggleEnableStatusOfSingleUserService(\''  + key + '\');"><i id=statusIconService_'+ key +' class="fas fa-toggle-on"></i></button><button type="button" class="btn btn-danger btn-sm" id="bt_delete'+ key +'" title="delete" onClick="deleteConfiguredService(\''  + key + '\');"><i class="fas fa-trash-alt"></i></button></div></div></div>');
                    }
                    else // show disabled configured service
                    {
                        $( "#conf_" + serviceCount ).append('<div class="col-sm-6"><div class="input-group input-group-sm mb-1"><div class="input-group-prepend"><div class="input-group-text"><i title="' + data[key]["type"] + '" class="' + data[key]["icon"] +'"></i></div></div><input type="text" class="form-control" id="label_' + data[key]["url"] + '" aria-label="Text input with checkbox" value='+ data[key]["name"] +' title=' + data[key]["url"] + ' disabled><div class="input-group-prepend"><button type="button" id="bt_configSingleService_'+ key +'" title="configure" class="btn btn-dark" onClick="configureSingleUserService(\''  + key + '\')"><i class="fas fa-cog"></i></button><button type="button" class="btn btn-secondary btn-sm" id="bt_'+ key +'" title="disabled" onClick="settingsToggleEnableStatusOfSingleUserService(\''  + key + '\');"><i id=statusIconService_'+ key +' class="fas fa-toggle-off"></i></button><button type="button" class="btn btn-danger btn-sm" id="bt_delete'+ key +'" title="delete" onClick="deleteConfiguredService(\''  + key + '\');"><i class="fas fa-trash-alt"></i></button></div></div></div>');
                    }
                }
                else // ...even - add to existing row - in col 2
                {
                    // add something to the existing row
                    var rowReference = serviceCount -1;

                    if(data[key]["serviceEnableStatus"] === true) // show enabled configured service
                    {
                        $( "#conf_" + rowReference  ).append('<div class="col-sm-6"><div class="input-group input-group-sm mb-1"><div class="input-group-prepend"><div class="input-group-text"><i title="' + data[key]["type"] + '" class="' + data[key]["icon"] +'"></i></div></div><input type="text" class="form-control" id="label_' + data[key]["url"] + '" aria-label="Text input with checkbox" value='+ data[key]["name"]+' title=' + data[key]["url"] + ' disabled><div class="input-group-prepend"><button type="button" id="bt_configSingleService_'+ key +'" title="configure" class="btn btn-dark" onClick="configureSingleUserService(\''  + key + '\')"><i class="fas fa-cog"></i></button><button type="button" class="btn btn-success btn-sm" id="bt_'+ key +'" title="enabled" onClick="settingsToggleEnableStatusOfSingleUserService(\''  + key + '\');"><i id=statusIconService_'+ key +' class="fas fa-toggle-on"></i></button><button type="button" class="btn btn-danger btn-sm" id="bt_delete'+ key +'" title="delete" onClick="deleteConfiguredService(\''  + key + '\');"><i class="fas fa-trash-alt"></i></button></div></div></div>');

                    }
                    else // show disabled configured service
                    {
                        $( "#conf_" + rowReference  ).append('<div class="col-sm-6"><div class="input-group input-group-sm mb-1"><div class="input-group-prepend"><div class="input-group-text"><i title="' + data[key]["type"] + '" class="' + data[key]["icon"] +'"></i></div></div><input type="text" class="form-control" id="label_' + data[key]["url"] + '" aria-label="Text input with checkbox" value='+ data[key]["name"] +' title=' + data[key]["url"] + ' disabled><div class="input-group-prepend"><button type="button" id="bt_configSingleService_'+ key +'" title="configure" class="btn btn-dark" onClick="configureSingleUserService(\''  + key + '\')"><i class="fas fa-cog"></i></button><button type="button" class="btn btn-secondary btn-sm" id="bt_'+ key +'" title="disabled" onClick="settingsToggleEnableStatusOfSingleUserService(\''  + key + '\');"><i id=statusIconService_'+ key +' class="fas fa-toggle-off"></i></button><button type="button" class="btn btn-danger btn-sm" id="bt_delete'+ key +'" title="delete" onClick="deleteConfiguredService(\''  + key + '\');"><i class="fas fa-trash-alt"></i></button></div></div></div>');
                    }
                }
                serviceCount = serviceCount +1;
            }
        }
    });

    writeLog("info", "loadConfiguredUserServices ::: Finished loading all configured user services to settings page");
}



/**
* @name initSettingsPage
* @summary Initializes the settings page
* @description Shows links to github informations. update informations. Initializes the service-checkboxes on loading the view
*/
function initSettingsPage()
{
    var curSettingAutostart;
    var curSettingHideMenubar;

    // load all supported services to checklist (used for adding new services)
    initAvailableServicesSelection();

    // show all user configured services
    loadConfiguredUserServices();

    // Setting: Autostart
    //
    curSettingAutostart = readLocalStorage("settingAutostart");
    if(curSettingAutostart === "true")
    {
        writeLog("info", "initSettingsPage ::: Setting Autostart is configured");

        // activate checkbox
        $("#checkboxSettingAutostart").prop("checked", true);
    }
    else
    {
        writeLog("info", "initSettingsPage ::: Setting Autostart is not configured");
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
            writeLog("info", "initSettingsPage ::: Hide menubar");
            $("#checkboxSettingHideMenubar").prop("checked", true);
            ipcRenderer.send("hideMenubar");
        }
        else
        {
            // show menubar
            ipcRenderer.send("showMenubar");
            $("#checkboxSettingHideMenubar").prop("checked", false);
            writeLog("info", "initSettingsPage ::: Show menubar");
        }
    }
}


/**
* @name removeServiceTab
* @summary Remove a single tab from UI
* @description Removes the li item fromtab menu, removed the tab itself
* @param tabId
*/
function removeServiceTab(tabId)
{
    writeLog("info", "removeServiceTab ::: Starting to remove the tab: _" + tabId + "_.");

    // remove item from menu
    $("#menu_" + tabId).remove();

    // remove tabcontent from tab pane
    $("#" + tabId).remove();

    // remove service from select for DefaultView
    $("#selectDefaultView option[value=" + tabId + "]").remove();

    writeLog("info", "removeServiceTab ::: Finished removing the tab: _" + tabId + "_.");
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
    writeLog("info", "addServiceTab ::: Starting to add the tab: _" + serviceId + "_.");

    // get amount of tabs
    var existingTabs = $("#myTabs li").length;

    // calculate new tab position
    var newTabPosition = existingTabs -1;

    // add new list item to unordner list (tabs/menu)
    //
    //$('#myTabs li:eq(' + newTabPosition + ')').after('<li class="nav-item small" id=menu_'+ serviceId +'><a class="nav-link ttth_nonSelectableText" id=target_' + serviceId +' href=#' + serviceId + ' role="tab" data-toggle="tab"><i class="' + serviceIcon +'"></i> ' + serviceName + ' <span id=badge_' + serviceId + ' class="badge badge-success"></span></a></li>');
    $("#myTabs li:eq(" + newTabPosition + ")").after("<li class='nav-item small' id=menu_"+ serviceId +"><a class='nav-link ttth_nonSelectableText' id=target_" + serviceId +" href=#" + serviceId + " role='tab' data-toggle='tab'><i class='" + serviceIcon +"'></i> " + serviceName + " <span id=badge_" + serviceId + " class='badge badge-success'></span></a></li>");

    writeLog("info", "addServiceTab :::Added the navigation tab for service: _" + serviceId + "_.");

    // add the tab itself to #tabPanes
    $( "#tabPanes" ).append( "<div role='tabpanel' class='tab-pane fade flex-fill ttth_resizer container-fluid' id=" + serviceId + "></div>" );
    writeLog("info", "addServiceTab :::Added the tab pane for service: _" + serviceId + "_.");

    // add webview  to new tab
    //$( "#"+ serviceId ).append( '<webview id=webview_' + serviceId + ' class="ttth_resizer" src=' + serviceUrl + ' preload='+ serviceInjectCode + ' userAgent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36"></webview>' );
    $( "#"+ serviceId ).append( "<webview id=webview_" + serviceId + " class='ttth_resizer' src=" + serviceUrl + " preload="+ serviceInjectCode + " userAgent='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36'></webview>" );

    writeLog("info", "addServiceTab :::Added the webview to the tab pane for service: _" + serviceId + "_.");

    writeLog("info", "addServiceTab ::: Finished adding the tab: _" + serviceId + "_.");

    // add service to select for DefaultView
    $("#selectDefaultView").append(new Option(serviceName, serviceId));

    loadServiceSpecificCode(serviceId, serviceType);
}


/**
* @name settingsToggleEnableStatusOfSingleUserService
* @summary Enables or disabled the status of a single user configured service
* @description User can enable or disable his configured services in settings page.
* @param configuredUserServiceConfigName - Name of the config file of the selected service
*/
function settingsToggleEnableStatusOfSingleUserService(configuredUserServiceConfigName)
{
    writeLog("info", "settingsToggleEnableStatusOfSingleUserService ::: Toggling the configured service defined in config file: _" + configuredUserServiceConfigName + "_.");

    const os = require("os");
    const storage = require("electron-json-storage");
    const dataPath = storage.getDataPath();

    var serviceEnableStatus;

    // get content from service configuration file
    storage.get(configuredUserServiceConfigName, function(error, data) {
        if (error)
        {
            throw error;
        }

        var type = data.type;
        var name = data.name;
        var icon = data.icon;
        var url =  data.url;
        var injectCode = data.injectCode;


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

            writeLog("info", "settingsToggleEnableStatusOfSingleUserService ::: Service _" + configuredUserServiceConfigName + "_ is now disabled.");

            //  show noty
            showNoty("success", "Disabled the service " + configuredUserServiceConfigName);
        }
        else
        {
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

            writeLog("info", "settingsToggleEnableStatusOfSingleUserService ::: Service _" + configuredUserServiceConfigName + "_ is now enabled.");

            //  show noty
            showNoty("success", "Enabled the service " + configuredUserServiceConfigName);
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
            if (error)
            {
                throw error;
            }

            // must re-set the globalShortcuts for all existing services / tabs - see #74
            updateGlobalServicesShortcuts();
        });
    });

    writeLog("info", "settingsToggleEnableStatusOfSingleUserService ::: Service _" + configuredUserServiceConfigName + "_ config file is now updated (status)");
}



/**
* @name loadEnabledUserServices
* @summary Reads all user configured service files and adds the enabled services as tabs
* @description Reads all user configured service files and adds the enabled services as tabs
*/
function loadEnabledUserServices()
{
    const storage = require("electron-json-storage");

    writeLog("info", "loadEnabledUserServices ::: Starting to fetch all user configured service files");

    // loop over all json files - add tab for the enabled ones
    storage.getAll(function(error, data)
    {
        if (error)
        {
            throw error;
        }

        // show object which contains all config files
        //writeLog("info", "loadEnabledUserServices ::: Object: " + data);
        //console.error(data);


        // TODO
        // - should sort the object before using it
        // - currently the services are sorted by its generated IDs


        // loop over upper object
        for (var key in data)
        {
            if (data.hasOwnProperty(key))
            {
                writeLog("info", "loadEnabledUserServices ::: " + key);
                writeLog("info", "loadEnabledUserServices ::: " + key + " -> " + data[key]);

                if(data[key]["serviceEnableStatus"] === true) // show enabled configured service
                {
                    writeLog("info", "loadEnabledUserServices ::: Trying to add the enabled service: _" + key + "_.");
                    addServiceTab(key, data[key]["type"], data[key]["name"], data[key]["icon"], data[key]["url"], data[key]["injectCode"]);
                }
                else
                {
                    writeLog("info", "loadEnabledUserServices ::: Skipped service: _" + key + "_, as it not enabled.");
                }
            }
        }
        writeLog("info", "loadEnabledUserServices ::: Finished current service: " + data);
    });
}


/**
* @name deleteConfiguredService
* @summary Deletes a single configured user service
* @description Removes the tab, deletes the service user config, reloads the settings view which shows all user configured services.
* @param serviceId - the service id
*/
function deleteConfiguredService(serviceId)
{
    writeLog("info", "deleteConfiguredService ::: Deleting the user service: _" + serviceId + "_.");

    // cleanup after deleting the entire service
    var webview = document.getElementById("webview_" + serviceId);

    // delete all Event handlers
    //
    $( "#webview_" + serviceId ).unbind("did-start-loading");
    $( "#webview_" + serviceId ).unbind("dom-ready");
    $( "#webview_" + serviceId ).unbind("did-stop-loading");
    $( "#webview_" + serviceId ).unbind("ipc-message");
    $( "#webview_" + serviceId ).unbind("new-window");
    writeLog("warn", "deleteConfiguredService ::: Deleted all event handlers from webview");

    // Delete the webview of this service
    $("#webview_" + serviceId).remove();
    writeLog("warn", "deleteConfiguredService ::: Removed the webview itself");

    // remove service tab in UI
    removeServiceTab(serviceId);

    // delete json config of this service
    //
    const storage = require("electron-json-storage");
    storage.remove(serviceId, function(error)
    {
        if (error)
        {
            throw error;
        }
    });

    writeLog("info", "deleteConfiguredService ::: Finished deleting the user service: _" + serviceId + "_.");

    showNoty("success", "Successfully deleted the service " + serviceId);

    // reload the main window
    const {ipcRenderer} = require("electron");
    ipcRenderer.send("reloadMainWindow");
}


/**
* @name settingsUserAddNewService
* @summary user wants to configure a new service
* @description user wants to configure a new service
*/
function settingsUserAddNewService()
{
    writeLog("info", "settingsUserAddNewService ::: Starting to add a new user configured service.");

    const os = require("os");
    const storage = require("electron-json-storage");
    const dataPath = storage.getDataPath();

    var serviceAllowsMultipleInstances;

    // get selected option from #select_availableServices
    var userSelectedService = $( "#select_availableServices" ).val();
    writeLog("info", "settingsUserAddNewService ::: Selected service type is: _" + userSelectedService + "_.");

    if( userSelectedService !== null )
    {
        writeLog("info", "settingsUserAddNewService ::: Should add a new service of type: _" + userSelectedService + "_.");

        // check if this service allows multiple instances
        writeLog("info", "settingsUserAddNewService ::: Checking if the service: _" + userSelectedService + "_ allows multiple instances");
        // Parse service template
        const url = __dirname + "/js/ttth/services.json";
        $.getJSON(url, function (data)
        {
            $.each(data, function (key, entry)
            {
                if(entry.id === userSelectedService)
                {
                    // check if it allows multiple instances
                    if(entry.multiple === true)
                    {
                        writeLog("info", "settingsUserAddNewService ::: Service: _" + userSelectedService + "_ allows multiple instances");
                        serviceAllowsMultipleInstances = true;

                        // send ipc to show second window
                        const {ipcRenderer} = require("electron");
                        ipcRenderer.send("showConfigureSingleServiceWindowNew", userSelectedService);

                    }
                    else // single instance service
                    {
                        writeLog("warn", "settingsUserAddNewService ::: Service: _" + userSelectedService + "_ does NOT allows multiple instances");
                        writeLog("info", "settingsUserAddNewService ::: Check if there already exists an instance of the service type: _" + userSelectedService + "_.");

                        // check if there is already a configured service of that type.
                        // check which configs already exist
                        storage.getAll(function(error, data)
                        {
                            if (error)
                            {
                                throw error;
                            }

                            // show object which contains all config files
                            writeLog("info", data);

                            for (var key in data)
                            {
                                if (data.hasOwnProperty(key))
                                {
                                    //writeLog("info", key + " -> " + data[key]);
                                    writeLog("info", data[key]["type"]);

                                    if(data[key]["type"] === userSelectedService)
                                    {
                                        showNoty("error", "There is already a configured service of the type " + userSelectedService + ".", 0);
                                        return;
                                    }
                                }
                            }

                            const {ipcRenderer} = require("electron");
                            ipcRenderer.send("showConfigureSingleServiceWindowNew", userSelectedService);
                        });

                    }
                }
            });
        });
    }
    else
    {
        writeLog("warn", "settingsUserAddNewService ::: No service type selected. Unable to add a new service.");
        showNoty("error", "No service type selected. Unable to add a new service.");
    }
}


/**
* @name generateNewRandomServiceID
* @summary Generates a config-file name while adding a new service
* @description Gets the serviceType and adds a random string. The outcome is the name for the new service config-file.
* @param serviceType - The type of the service
* @return newServiceId - serviceType + Random string 
*/
function generateNewRandomServiceID(serviceType)
{
    var i = 0;
    var length = 24;
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var randomString = "";
    var newServiceId = "";

    // create random string
    for (i = 0; i < length; i++)
    {
        randomString += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    newServiceId = serviceType + "_" + randomString;

    writeLog("info", "generateNewRandomServiceID ::: Generated a new service ID: _" + newServiceId + "_.");

    return newServiceId;
}


/**
* @name updateGlobalServicesShortcuts
* @summary Assigns global shortcuts for all service tabs
* @description Assigns global shortcuts for all service tabs
*/
function updateGlobalServicesShortcuts()
{
    const {ipcRenderer} = require("electron");

    var tabCounter = 0;
    var currentTabId;
    var numberOfEnabledServices; // counts the amount of enabled user services

    writeLog("info", "updateGlobalServicesShortcuts ::: Starting to update global service shortcuts");


    // Ensure to remove all possible shortcuts before re-creating them. See #74
    //
    // count enabled services:
    numberOfEnabledServices = $("#myTabs li").length;
    ipcRenderer.send("deleteAllGlobalServicesShortcut", numberOfEnabledServices);

    // Create new global shortcutd
    $("#myTabs li a").each(function()
    {
        currentTabId = $(this).attr("id");
        if(currentTabId === "target_Settings")
        {
           writeLog("info", "updateGlobalServicesShortcuts ::: Ignoring settings tab.");
        }
        else
        {
            tabCounter = tabCounter +1;

            // globalShortcut
            ipcRenderer.send("createNewGlobalShortcut", "CmdOrCtrl+" + tabCounter, currentTabId);
        }
    });

    // show notification
    /*
    if(tabCounter > 0) // if at least 1 accesskey was set
    {
        //showNoty("success", "Updating accesskeys for enabled service tabs.")
    }
    */

    writeLog("info", "updateGlobalServicesShortcuts ::: Finished updating global shortcuts for services");
}


/**
* @name localizeUserInterface
* @summary Localizes the user interface
* @description Is using i18next to localize the user interface. Translations are located in app/locales/
*/
function localizeUserInterface()
{
    const isDev = require("electron-is-dev");

    var userLang;

    // detect user language
    //
    userLang = navigator.language || navigator.userLanguage;

    // if the project is not packaged - overwrite the language to EN. This is used to ensure the screenshots are in the expected language
    if (isDev)
    {
        //userLang = "en";
    }
    writeLog("info", "localizeUserInterface ::: Detected user language: " + userLang);

    var i18next = require("i18next");
    var Backend = require("i18next-sync-fs-backend");

    i18next
    .use(Backend)
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
        // text
        $("[i18n-text]").each(function()
        {
            var node = $(this), key = node.attr("i18n-text");
            node.text(i18next.t(key));
        });

        // attribute: title
        $("[i18n-title]").each(function()
        {
            var node = $(this), key = node.attr("i18n-title");
            node.attr("title", i18next.t(key));
        });

        // attribute: placeholder
        $("[i18n-placeholder]").each(function()
        {
            var node = $(this), key = node.attr("i18n-placeholder");
            node.attr("placeholder", i18next.t(key));
        });

        // attribute: value
        $("[i18n-value]").each(function()
        {
            var node = $(this), key = node.attr("i18n-value");
            node.attr("value", i18next.t(key));
        });

    });
}


// Call from main.js ::: reloadCurrentService
//
require("electron").ipcRenderer.on("reloadCurrentService", function(event, message)
{
    //writeLog("info", message);  // Prints "whoooooooh!"

    // get href of current active tab
    var tabValue = $(".nav-tabs .active").attr("href");
    tabValue = tabValue.substring(1); // cut the first char ( =  #)
    writeLog("info", "reloadCurrentService ::: Current active tab is: " + tabValue);


    // get configured target url & inject code from config
    const storage = require("electron-json-storage");

    storage.get(tabValue, function(error, data)
    {
        if (error)
        {
            throw error;
        }

        var url =  data.url;
        var injectCode = data.injectCode;

        writeLog("info", "reloadCurrentService ::: Set URL of webview to: _" + url + "_.");
        document.getElementById( "webview_" + tabValue ).loadURL(url);

        // TODO
        // inject code
    });
});


// Call from main.js ::: showSettings
//
require("electron").ipcRenderer.on("showSettings", function(event)
{
    writeLog("info", "showSettings ::: Switching to Settings tab");
    switchToService("Settings");
});


// Call from main.js ::: startSearchUpdates
//
require("electron").ipcRenderer.on("startSearchUpdates", function(event)
{
    writeLog("info", "startSearchUpdates ::: Show update information div");

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
    writeLog("info", "nextTab ::: Active tab is: " + currentActiveTabId);

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

    writeLog("info", "nextTab ::: Should switch to: " + serviceName + " now.");

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
    writeLog("info", "previous ::: Active tab is: " + currentActiveTabId);

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

    writeLog("info", "previousTab ::: Should switch to: " + serviceName + " now.");

    // jump to previous tab
    switchToService(serviceName);
});



// Call from main.js ::: serviceToCreate (in configServiceWindow)
//
require("electron").ipcRenderer.on("serviceToCreate", function(event, serviceId)
{
    writeLog("info", "serviceToCreate ::: Should create a new service of type: _" + serviceId + "_.");
    writeLog("info", "serviceToCreate ::: Loading default values from service definition");

    // generate id for new service
    var newServiceId = generateNewRandomServiceID(serviceId);

    // read json file
    const url = __dirname + "/js/ttth/services.json";
    $.getJSON(url, function (data)
    {
        $.each(data, function (key, entry)
        {
            if(entry.id === serviceId)
            {
                // update UI with default values
                $("#input_serviceId").val(newServiceId);
                $("#input_serviceType").val(entry.id);
                $("#input_serviceName").val(entry.name);
                $("#input_serviceIcon").val(entry.icon);
                $("#input_serviceUrl").val(entry.url);
                $("#input_serviceInjectCode").val(entry.injectCode);
                $("#input_serviceEnableStatus").val(true);

                // hide save buttons
                $("#bt_saveExistingService").hide();

                // show the add-new-service button
                $("#bt_addNewService").show();

                // preview the icon
                previewIcon();

                writeLog("info", "serviceToCreate ::: Loaded default values for this service-type to UI");
            }
        });
    });
});


// Call from main.js ::: serviceToConfigure (in configServiceWindow)
//
require("electron").ipcRenderer.on("serviceToConfigure", function(event, serviceId)
{
    const storage = require("electron-json-storage");

    writeLog("info", "serviceToConfigure ::: Should configure the service: " + serviceId);
    writeLog("info", "serviceToConfigure ::: Loading current values from service config");

    storage.get(serviceId, function(error, data)
    {
        if (error)
        {
            throw error;
        }

        var type = data.type;
        var name = data.name;
        var icon = data.icon;
        var url =  data.url;
        var injectCode = data.injectCode;
        var status = data.serviceEnableStatus;

        // update UI of second window
        $("#input_serviceId").val(serviceId);
        $("#input_serviceType").val(type);
        $("#input_serviceName").val(name);
        $("#input_serviceIcon").val(icon);
        $("#input_serviceUrl").val(url);
        $("#input_serviceInjectCode").val(injectCode);
        $("#input_serviceEnableStatus").val(status);

        // hide Add-new-service button
        $("#bt_addNewService").hide();

        // show the edit service  button
        $("#bt_saveExistingService").show();

        // preview the icon
        previewIcon();

        writeLog("info", "serviceToConfigure ::: Loaded current values for this service to UI");
    });
});


// Call from main.js ::: switchToTab
//
require("electron").ipcRenderer.on("switchToTab", function(event, targetTab)
{
    writeLog("info", "switchToTab ::: Switching to tab: " + targetTab);
    $("#" + targetTab).trigger("click");
});



// Call from main.js ::: 
//
require("electron").ipcRenderer.on("showNoConnectivityError", function(event)
{
    writeLog("error", "showNoConnectivityError ::: There is no internet connection.");
    showNoty("error", "No access to the internet.", 0);
});
