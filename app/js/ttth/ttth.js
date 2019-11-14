
// ----------------------------------------------------------------------------
// Error Handling
// ----------------------------------------------------------------------------
//
require("./js/ttth/crashReporting.js");
//myUndefinedFunctionFromRenderer();



/**
* @name initTitlebar
* @summary Init the titlebar for the frameless mainWindow
* @description Creates a custom titlebar for the mainWindow using custom-electron-titlebar (https://github.com/AlexTorresSk/custom-electron-titlebar).
*/
function initTitlebar()
{
    // NOTE:
    // - "custom-electron-titlebar" is now an archived repo
    // - switched to fork of it "pj-custom-electron-titlebar"
    const customTitlebar = require("pj-custom-electron-titlebar");


    let myTitlebar = new customTitlebar.Titlebar({
        titleHorizontalAlignment: "center", // position of window title
        icon: "img/icon/icon.png",
        drag: true, // whether or not you can drag the window by holding the click on the title bar.
        backgroundColor: customTitlebar.Color.fromHex("#171717"),
        minimizable: true,
        maximizable: true,
        closeable: true,
        itemBackgroundColor: customTitlebar.Color.fromHex("#525252") // hover color
    });

    // change font size of application name in titlebar
    $(".window-title").css("font-size", "13px"); // https://github.com/AlexTorresSk/custom-electron-titlebar/issues/24


    // Try to change color of menu
    //
    // works - but results in follow error:         myTitlebar.updateBackground("#ff0000");
    // followerror: titleBackground.isLigher is not a function
    //myTitlebar.updateBackground("#ff00ff");


    // Trying to update the title
    //myTitlebar.updateTitle("TTTH");
}


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
    const Noty = require("noty");
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

        case "debug" :
            //logR.debug(logMessage); // to file
            console.debug(logMessage); // to console
            break;

      default:
         //logR.info(logMessage); // to file
         console.log(logMessage);
   }
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
        writeLog("info", "isMac ::: No apples here");
        return false;
    }
}


/**
* @name isLinux
* @summary Checks if the operating system type is linux or not
* @description Checks if the operating system type islinux or not
* @return value - Boolean: True if linux, false if not
*/
function isLinux()
{
    var os = require("os");

    // os types:
    //
    // - Darwin
    // - Linux
    // - Windows_NT
    writeLog("info", "isLinux ::: Detected operating system type is: " + os.type());
    if(os.type() === "Linux")
    {
        writeLog("info", "isLinux ::: Smelling penguins");
        return true;
    }
    else
    {
        writeLog("info", "isLinux ::: No penguins here");
        return false;
    }
}


/**
* @name isWindows
* @summary Checks if the operating system type is windows or not
* @description Checks if the operating system type is windows or not
* @return value - Boolean: True if windows, false if not
*/
function isWindows()
{
    var os = require("os");

    // os types:
    //
    // - Darwin
    // - Linux
    // - Windows_NT
    writeLog("info", "isWindows ::: Detected operating system type is: " + os.type());
    if(os.type() === "Windows NT")
    {
        writeLog("info", "isWindows ::: Looks like Redmond");
        return true;
    }
    else
    {
        writeLog("info", "isWindows ::: There are no windows ... omg");
        return false;
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
    // activate the related tab
    $("#target_" + serviceName).trigger("click");

    writeLog("info", "switchToService ::: Switched to tab: _" + serviceName + "_.");
}


/**
* @name writeLocalUserSetting
* @summary Write to electron-json-storage
* @description Writes a value for a given key to electron-json-storage
* @param key - Name of storage key
* @param value - New value
*/
function writeLocalUserSetting(key,value)
{
    const storage = require("electron-json-storage");
    const remote = require("electron").remote;
    const app = remote.app;
    const path = require("path");

    // get default storage path
    const defaultDataPath = storage.getDefaultDataPath();

    // set new path for userUsettings
    const userSettingsPath = path.join(app.getPath("userData"), "ttthUserSettings");
    storage.setDataPath(userSettingsPath);

    // write the user setting
    storage.set(key, { "setting": value }, function(error) {
        if (error)
        {
            throw error;
        }
      writeLog("info", "writeLocalUserSetting ::: key: _" + key + "_ - new value: _" + value + "_");

      // revert:
      storage.setDataPath(defaultDataPath);
    });
}


/**
* @name loadDefaultView
* @summary Loads the default view
* @description Loads the default view. This is used on load of the .html
*/
function loadDefaultView(newDefaultView)
{
    writeLog("info", "loadDefaultView ::: Found configured default view: _" + newDefaultView + "_.");
    switchToService(newDefaultView);
}


/**
* @name settingDefaultViewReset
* @summary Reset the stored default view
* @description Deletes the localstorage key 'settingDefaultview'
*/
function settingDefaultViewReset()
{
    writeLocalUserSetting("settingDefaultView", false);

    // reset the selection of the select item
    $("#selectDefaultView").prop("selectedIndex",0);

    writeLog("info", "settingDefaultViewReset ::: Did reset the default view");
}


/**
* @name settingActivateUserColorCss
* @summary Activates a css style
* @description Activates a css style / theme
* @param cssStyleName - Name of the css file
*/
function settingActivateUserColorCss(cssFile)
{
    console.log("settingActivateUserColorCss ::: Loading css file: _" + cssFile + "_.");

    // load custom css file
    $("<link/>", {
        rel: "stylesheet",
        type: "text/css",
        href: "css/ttth/themes/" + cssFile
    }).appendTo("head");
}


/**
* @name settingThemeUpdate
* @summary Updates which theme is selected
* @description Sets the new theme and activates a css style / theme
*/
function settingThemeUpdate()
{
    // get values from theme select
    var currentSelectedTheme = $("#selectTheme").val(); // displayed theme css name
    var currentSelectedThemeDisplayName = $( "#selectTheme option:selected" ).text(); // displayed theme name

    // activate the theme
    settingActivateUserColorCss(currentSelectedTheme);

    // write Setting
    writeLocalUserSetting("settingTheme", currentSelectedTheme);

    // noty
    showNoty("success", "<i class='fas fa-toggle-on'></i> <b>Option:</b> <u>Theme</u> changed to " + currentSelectedThemeDisplayName + ".");

    // log
    console.log("settingThemeUpdate ::: Updating user selected css file to: _" + currentSelectedTheme + "_.");
}

/**
* @name settingThemeReset
* @summary Resets the selected theme back to default
* @description Sets the new theme and activates a css style / theme
*/
function settingThemeReset()
{
    // reset the selection of the select item
    $("#selectTheme").prop("selectedIndex",0);

    var currentSelectedTheme = "mainWindow_default.css";

    // load default theme
    settingActivateUserColorCss(currentSelectedTheme);

    // write setting
    writeLocalUserSetting("settingTheme", currentSelectedTheme);

    // noty
    showNoty("success", "<i class='fas fa-toggle-on'></i> Changed <b>Option:</b> <u>Theme</u> back to default.");

    // log
    console.log("settingThemeReset ::: Resetting user selected css file back to default: _" + currentSelectedTheme + "_.");
}


/**
* @name readLocalUserSetting
* @summary Read from local storage
* @description Reads a value stored in local storage (for a given key)
* @param key - Name of local storage key
* @param optional Boolean used for an ugly hack
*/
function readLocalUserSetting(key, optional=false)
{
    const storage = require("electron-json-storage");
    const remote = require("electron").remote;
    const app = remote.app;
    const path = require("path");

    writeLog("info", "readLocalUserSetting ::: Trying to read value of key: " + key);

    // get default storage path
    const defaultDataPath = storage.getDefaultDataPath();

    // change path for userSettings
    const userSettingsPath = path.join(app.getPath("userData"), "ttthUserSettings");
    storage.setDataPath(userSettingsPath);

    // read the json file
    storage.get(key, function(error, data)
    {
        if (error)
        {
            throw error;
        }

        var value = data.setting;

        writeLog("info", "readLocalUserSetting ::: key: _" + key + "_ - got value: _" + value +"_");

        // revert storage path
        storage.setDataPath(defaultDataPath);

        // setting DefaultView
        if(key === "settingDefaultView")
        {
            if(value === null) // no default view configured
            {
                writeLog("info", "validateConfiguredDefaultView ::: No default configured - Stay on settings-view");
            }
            else
            {
                writeLog("info", "validateConfiguredDefaultView ::: Found configured default view: " + value);

                // check if the configured service is enabled or not
                writeLog("info", "validateConfiguredDefaultView ::: Check if configured default view is an enabled service or not");

                var exists = false;

                // Check if Dropdown contains the defined default view as enabled service
                $("#selectDefaultView option").each(function()
                {
                    if (this.value === value)
                    {
                        exists = true;
                        return false;
                    }
                });

                if(exists)
                {
                    writeLog("info", "validateConfiguredDefaultView ::: Configured default view is valid");

                    // Update select
                    $("#selectDefaultView").val(value);

                    // load the default view
                    loadDefaultView(value);
                }
                else
                {
                    writeLog("warning", "validateConfiguredDefaultView ::: Fallback to default (setting-view)");

                    // reset the selection of the select item
                    $("#selectDefaultView").prop("selectedIndex",0);

                    // delete the localstorage entry for defaultview
                    settingDefaultViewReset();
                }
            }
        }


        // Setting Theme
        //
        if(key === "settingTheme")
        {
            writeLog("info", "initSettingsPage ::: Setting Theme is configured to: _" + value + "_.");

            if((value === null) | (value === undefined))
            {
                // fallback to default
                settingActivateUserColorCss("mainWindow_default.css");
            }
            else
            {
                settingActivateUserColorCss(value);

                // Update select
                $("#selectTheme").val(value);
            }
        }
        // End: Theme


        // Setting Autostart
        //
        if(key === "settingAutostart")
        {
            if(value === true)
            {
                writeLog("info", "initSettingsPage ::: Setting Autostart is configured");
                $("#checkboxSettingAutostart").prop("checked", true);
            }
            else
            {
                writeLog("info", "initSettingsPage ::: Setting Autostart is not configured");
                $("#checkboxSettingAutostart").prop("checked", false);
            }
        }
        // End: Autostart


        // Setting DisableTray
        //
        if(key === "settingDisableTray")
        {
            if(isLinux())
            {
                if(value === true)
                {
                    const {ipcRenderer} = require("electron");

                    writeLog("info", "initSettingsPage ::: Setting DisableTray is configured");
                    $("#checkboxSettingDisableTray").prop("checked", true);
                    ipcRenderer.send("disableTray");
                }
            }
            else
            {
                // hide the entire setting on settingspage
                $("#settingsSectionDisableTray").hide();
            }
        }
        // End DisableTRay


        // Setting Urgent Window - #110
        if(key === "settingUrgentWindow")
        {
            if(value === true)
            {
                const {ipcRenderer} = require("electron");

                $("#checkboxSettingUrgentWindow").prop("checked", true);

                if(optional === true)
                {
                    ipcRenderer.send("makeWindowUrgent");
                }

                writeLog("info", "initSettingsPage ::: Setting UrgentWindow is enabled");
            }
        }
        // End: Urgent Window
    });
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
* @name settingToggleDisableTray
* @summary Enables or disabled the Tray
* @description Updates the settings / option DisableTray
*/
function settingToggleDisableTray()
{
    const {ipcRenderer} = require("electron");

    // Handle depending on the checkbox state
    if($("#checkboxSettingDisableTray").prop("checked"))
    {
        ipcRenderer.send("disableTray");
        writeLocalUserSetting("settingDisableTray", true);
        showNoty("success", "<i class='fas fa-toggle-on'></i> <b>Option:</b> <u>Disable Tray</u> is now enabled.");
        writeLog("info", "settingToggleDisableTray ::: Finished enabling DisableTray");
    }
    else
    {
        ipcRenderer.send("recreateTray");
        writeLocalUserSetting("settingDisableTray", false);
        showNoty("success", "<i class='fas fa-toggle-off'></i> <b>Option:</b> <u>Disable Tray</u> is now disabled.");
        writeLog("info", "settingToggleDisableTray ::: Finished re-enabling DisableTray");
    }
}


/**
* @name settingToggleUrgentWindow
* @summary Enables or disabled the urgent window mode
* @description Updates the settings / option Urgentwindow
*/
function settingToggleUrgentWindow()
{
    // Handle depending on the checkbox state
    if($("#checkboxSettingUrgentWindow").prop("checked"))
    {
        writeLocalUserSetting("settingUrgentWindow", true);
        showNoty("success", "<i class='fas fa-toggle-on'></i> <b>Option:</b> <u>Urgent window</u> is now enabled.");
        writeLog("info", "settingToggleUrgentWindow ::: Finished enabling UrgentWindow");
    }
    else
    {
        writeLocalUserSetting("settingUrgentWindow", false);
        showNoty("success", "<i class='fas fa-toggle-off'></i> <b>Option:</b> <u>Urgent window</u> is now disabled.");
        writeLog("info", "settingToggleUrgentWindow ::: Finished re-enabling UrgentWindow");
    }
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
    /*
    else // this code should never be triggered - might be deleteable.
    {
        // disable the add button
        $("#bt_addNewService").prop("disabled", true);

        // change button type to success
        $("#bt_addNewService").removeClass();
        $("#bt_addNewService").addClass("btn btn-secondary btn-sm");

        writeLog("info", "settingsSelectServiceToAddChanged ::: Disabled the add-service button.");
    }
    */
}


/**
* @name showNotyAutostartMinimizedConfirm
* @summary Shows a dialog while configuring the autostart.
* @description Asks the user if the autostart should be minimized or not
*/
function showNotyAutostartMinimizedConfirm()
{
    var AutoLaunch = require("auto-launch");
    const Noty = require("noty");
    var n = new Noty(
    {
        theme: "bootstrap-v4",
        layout: "bottom",
        type: "information",
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
                    writeLocalUserSetting("settingAutostart", true);
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
                    writeLocalUserSetting("settingAutostart", true);
                    n.close();
                    showNoty("success", "<i class='fas fa-toggle-on'></i> <b>Option:</b> <u>Autostart (on login)</u> is now enabled.");
                })
            ]
    });

    // show the noty dialog
    n.show();

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
* @name openUserSettingsConfigFolder
* @summary Opens the folder in filesystem which contains the user settings
* @description Triggers a method in main.js which then opens the folder which contains all user settings
*/
function openUserSettingsConfigFolder()
{
    const {ipcRenderer} = require("electron");
    ipcRenderer.send("openUserSettingsConfigFolder");
    writeLog("info", "openUserSettingsConfigFolder ::: Should try to open the folder which contains the user settings.");
}


/**
* @name updateTrayIconStatus
* @summary Updates the tray icon
* @description Checks the tabs of all services and fetches the content of the related batch. Based on the overall unread message account it triggers the update of the tray icon
*/
function updateTrayIconStatus()
{
    var overallUnreadMessages = 0; // counts unread messages for all enabled services
    var curServiceUnreadMessageCount = 0; // contains the unread-message count for a single service
    var currentTabId;

    // loop over all tabs - count unread messages
    $("#myTabs li a").each(function()
    {
        currentTabId = $(this).attr("id");

        if(currentTabId !== "target_Settings") // for all tabs - but NOT for the settings tab
        {
            currentTabId = currentTabId.replace("target_", "");

            curServiceUnreadMessageCount = 0; // reset to 0
            curServiceUnreadMessageCount = $("#badge_" + currentTabId ).html();
            curServiceUnreadMessageCount = Number(curServiceUnreadMessageCount);

            // if the current service has a significant unread message count -> log it and add it to overall counter
            if( (curServiceUnreadMessageCount !== 0) && (curServiceUnreadMessageCount !== "") && (curServiceUnreadMessageCount !== null) )
            {
                // increase the overall counter
                overallUnreadMessages = overallUnreadMessages + curServiceUnreadMessageCount;
            }

            writeLog("info", "updateTrayIconStatus ::: Unread messages count of _" + currentTabId + "_ is: " + curServiceUnreadMessageCount);
        }
    });

    writeLog("info", "updateTrayIconStatus ::: Overall unread message count for all services is: _" + overallUnreadMessages + "_.");

    const {ipcRenderer} = require("electron");
    if( (overallUnreadMessages === "0" ) || (overallUnreadMessages === 0 ) ) // tray should show the default icon
    {
        ipcRenderer.send("changeTrayIconToDefault");
    }
    else // tray should show that we got unread messages
    {
        ipcRenderer.send("changeTrayIconToUnreadMessages");
        readLocalUserSetting("settingUrgentWindow", true);
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
    if( (count === null) || (count === 0) || (count === "null") || (count === "0") )
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
    writeLog("info", "eventListenerForSingleService ::: Adding event listeners for webview: _webview_" + serviceId + "_.");

    // get webview
    var webview = document.getElementById("webview_" + serviceId);

    // run it periodically
    //
    //  5.000 =  5 sec
    var intervalID = setInterval(function()
    {
        webview.send("request");
    }, 3000); // 3.000 milliseconds = 3 sec


    // TODO:
    // add a network-connectivity check for each single service?


    // adding general webview events (valid for all services)
    //
    //

    // WebView Event: load-commit (https://electronjs.org/docs/api/webview-tag#event-load-commit)
    //
    webview.addEventListener("load-commit", function()
    {
        writeLog("info", "eventListenerForSingleService ::: load-commit for: _" + serviceId + "_.");

        // start to spin the service icon in the tabmenu
        doAnimateServiceIcon(true, serviceId);
    });



    // WebView Event: did-fail-load (https://electronjs.org/docs/api/webview-tag#event-did-fail-load)
    //
    webview.addEventListener("did-fail-load", function()
    {
        writeLog("error", "eventListenerForSingleService ::: did-fail-load for: _" + serviceId + "_.");

        // stop to spin the service icon in the tabmenu
        doAnimateServiceIcon(false, serviceId);

        var checkForMicrosoftOutlook = serviceId.startsWith("microsoftOutlook");
        var checkForMicrosoftTeams = serviceId.startsWith("microsoftTeams");
        if( (checkForMicrosoftOutlook === false) && (checkForMicrosoftTeams === false) ) // show noty for all services except microsoftOutlook & microsoftTeams (as it throws tons of errors)
        {
            showNoty("error", "Failed to load url for service: <b>" + serviceId + "</b>.", 0); // #119
        }
    });

    // WebView Event: crashed (https://electronjs.org/docs/api/webview-tag#event-crashed)
    //
    webview.addEventListener("crashed", function(e)
    {
        // stop to spin the service icon in the tabmenu
        doAnimateServiceIcon(false, serviceId);

        writeLog("error", "eventListenerForSingleService ::: crashed for: _" + serviceId + "_.");
        writeLog("error", e);
        showNoty("error", "Ooops, the service <b>" + serviceId + "</b> crashed.", 0);
    });

    // WebView Event: page-title-updated (https://electronjs.org/docs/api/webview-tag#event-page-title-updated)
    //
    webview.addEventListener("page-title-updated", function()
    {
        writeLog("info", "eventListenerForSingleService ::: page-title-updated for: _" + serviceId + "_.");
    });

    // WebView Event: plugin-crashed (https://electronjs.org/docs/api/webview-tag#event-plugin-crashed)
    //
    webview.addEventListener("plugin-crashed", function()
    {
        writeLog("error", "eventListenerForSingleService ::: plugin-crashed for: _" + serviceId + "_.");
    });

    // WebView Event: destroyed (https://electronjs.org/docs/api/webview-tag#event-destroyed)
    //
    webview.addEventListener("destroyed", function()
    {
        writeLog("error", "eventListenerForSingleService ::: destroyed for: _" + serviceId + "_.");
    });

    // WebView Event: update-target-url (https://electronjs.org/docs/api/webview-tag#event-update-target-url)
    //
    webview.addEventListener("update-target-url", function()
    {
        writeLog("info", "eventListenerForSingleService ::: update-target-url for: _" + serviceId + "_.");
    });

    // WebView Event: devtools-opened (htps://electronjs.org/docs/api/webview-tag#event-devtools-opened)
    //
    webview.addEventListener("devtools-opened", function()
    {
        writeLog("info", "eventListenerForSingleService ::: devtools-opened for: _" + serviceId + "_.");
    });

    // WebView Event: devtools closed (https://electronjs.org/docs/api/webview-tag#event-devtools-closed)
    //
    webview.addEventListener("devtools closed", function()
    {
        writeLog("info", "eventListenerForSingleService ::: devtools closed for: _" + serviceId + "_.");
    });

    // WebView Event: close (https://electronjs.org/docs/api/webview-tag#event-close)
    //
    webview.addEventListener("close", function()
    {
        writeLog("info", "eventListenerForSingleService ::: close for: _" + serviceId + "_.");
    });

    // WebView Event: console-message (https://electronjs.org/docs/api/webview-tag#event-console-message)
    //
    //webview.addEventListener("console-message", function()
    //{
        //writeLog("info", "eventListenerForSingleService ::: console-message");
    //});


    // WebView Event: did-start-loading
    //
    webview.addEventListener("did-start-loading", function()
    {
        writeLog("info", "eventListenerForSingleService ::: did-start-loading for: _" + serviceId + "_.");

        // start to spin the service icon in the tabmenu
        doAnimateServiceIcon(true, serviceId);

        // Triggering search for unread messages
    webview.send("request");
    });


    // WebView Event: did-finish-load
    //
    webview.addEventListener("did-finish-load", function()
    {
        writeLog("info", "eventListenerForSingleService ::: did-finish-load for: _" + serviceId + "_.");

        // stop to spin the service icon in the tabmenu
        doAnimateServiceIcon(false, serviceId);

    });


    // WebView Event: did-stop-loading
    //
    webview.addEventListener("did-stop-loading", function()
    {
        writeLog("info", "eventListenerForSingleService ::: did-stop-loading for: _" + serviceId + "_.");

        // stop to spin the service icon in the tabmenu
        doAnimateServiceIcon(false, serviceId);

        // Triggering search for unread messages
        //webview.send("request");
    });

    // WebView Event: dom-ready
    //
    webview.addEventListener("dom-ready", function()
    {
        writeLog("info", "eventListenerForSingleService ::: DOM-Ready for: _" + serviceId + "_.");

        // stop to spin the service icon in the tabmenu
        doAnimateServiceIcon(false, serviceId);

            // Triggering search for unread messages
            //webview.send("request");
    });





    // WebView Events for UnreadMessageHandling
    //
    if(enableUnreadMessageHandling === true)
    {
        // WebView Event:  ipc-message
        //
        webview.addEventListener("ipc-message", (event) => {
            writeLog("info", "eventListenerForSingleService ::: ipc-message for: _" + serviceId + "_.");

            // update the badge
            if(event.channel !== null)
            {
                updateServiceBadge(serviceId, event.channel);
            }
        });
    }
    // /WebView Events for UnreadMessageHandling


    // WebView Event: new-window / clicking links
    //
    if(enableLinkSupport === true)
    {
        webview.addEventListener("new-window", function(event)
        {
            writeLog("info", "eventListenerForSingleService ::: new-window for: _" + serviceId + "_.");

            const shell = require("electron").shell;
            const protocol = require("url").parse(event.url).protocol;

            if (protocol === "http:" || protocol === "https:")
            {
                // Display warning for http links - see: https://electronjs.org/docs/tutorial/security
                if (protocol === "http:")
                {
                    const Noty = require("noty");
                    var n = new Noty(
                    {
                        theme: "bootstrap-v4",
                        layout: "bottom",
                        type: "information",
                        text: "Do you really want to open this unsecure (not using https://) link?",
                        buttons: [
                                Noty.button("Yes", "btn btn-success", function ()
                                {
                                    n.close();
                                    writeLog("info", "User confirmed to open non-https:// link: _" + event.url + "_.");
                                    shell.openExternal(event.url);
                                },
                                {
                                    id: "button1", "data-status": "ok"
                                }),

                                Noty.button("No", "btn btn-secondary", function ()
                                {
                                    n.close();
                                })
                            ]
                    });

                    // show the noty dialog
                    n.show();
                } // its https://
                else
                {
                    shell.openExternal(event.url);
                }
            }
        });
    }
    // /WebView Event: new-window / clicking links

    writeLog("info", "eventListenerForSingleService ::: End for service: _" + serviceId + "_.");
}


/**
* @name doAnimateServiceIcon
* @summary Starts or stops the animation of the service tab icon
* @description Adds or removes a class to the service icon in the related service tab.
* @param doOrDont - Boolean. True = enable animation, false = stop the animation.
* @param serviceId - The id of the related service
*/
function doAnimateServiceIcon(doOrDont, serviceId)
{
    // Font Awesome: Animating icons:
    // https://fontawesome.com/how-to-use/on-the-web/styling/animating-icons

    if (doOrDont)
    {
        // start to spin the service icon in the tabmenu
        $( "#icon_" + serviceId ).addClass( "fa-spin" );

        writeLog("info", "doAnimateServiceIcon ::: Started to animate the icon of the service _" + serviceId + "_.");
    }
    else
    {
        // stop to spin the service icon in the tabmenu
        $( "#icon_" + serviceId ).removeClass( "fa-spin" );

        writeLog("info", "doAnimateServiceIcon ::: Stopped animating the icon of the service _" + serviceId + "_.");
    }
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
    writeLog("info", "updateSingleServiceConfiguration ::: Starting to create a new service config");

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

    // send ipc to show service-configuration window
    const {ipcRenderer} = require("electron");
    ipcRenderer.send("showConfigureSingleServiceWindow", serviceId);
}


/**
* @name openDevTools
* @summary Toggles the DevConsole
* @description Opens or closes the Developer Console inside the app. Gets called from mainWindow.html
*/
function openDevTools()
{
    writeLog("info", "openDevTools ::: Opening Developer Console");

    const remote = require("electron").remote;
    remote.getCurrentWindow().toggleDevTools();
}


/**
* @name settingToggleAutostart
* @summary Enables or disables the autostart
* @description Enables or disables the autostart
*/
function settingToggleAutostart()
{
    const isDev = require("electron-is-dev");
    if( isDev )
    {
        showNoty("warning", "Configuring autostart is only supported in packaged builds.");

        // unselect the autostart checkbox
        $( "#checkboxSettingAutostart" ).prop( "checked", false );
    }
    else
    {
        var AutoLaunch = require("auto-launch"); // auto-launch - via: https://www.npmjs.com/package/auto-launch

        var ttthAutoLauncher = new AutoLaunch({
            name: "ttth",
            useLaunchAgent: true,
        });

        // Handle depending on the checkbox state
        if($("#checkboxSettingAutostart").prop("checked")) // enabling the autostart
        {
            showNotyAutostartMinimizedConfirm();
        }
        else // disabling the autostart
        {
            ttthAutoLauncher.disable();
            writeLocalUserSetting("settingAutostart", false);
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

    if(newDefaultView !== null)
    {
        writeLog("info", "settingDefaultViewUpdate ::: New default view on start is set to: " + newDefaultView);

        // Store new default view in local storage
        writeLocalUserSetting("settingDefaultView", newDefaultView);

        // show noty
        showNoty("success", "Set default view to <b>" + newDefaultView + "</b>.");
    }
    else // user forgot to select a service for new default view
    {
        showNoty("warning", "Please <b>choose a service</b> to set a custom <b>default view</b>.");
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
    var userPlatform = process.platform; // process.platform (works without require) vs os.platform

    writeLog("info", "checkSupportedOperatingSystem ::: Detected operating system as: " + userPlatform);

    switch(userPlatform)
    {
        case "win32":
        case "windows":
        case "linux":
        case "darwin":
        case "freebsd":
            writeLog("info", "checkSupportedOperatingSystem ::: Operating system " + userPlatform + " is fine." );
            break;

        default:
            // could be: sunos

            // define message
            supportedOperatingSystemMessage = userPlatform + " is currently not supported. Please contact devs.";

            showNoty("warning", supportedOperatingSystemMessage, 0);
            writeLog("error", "checkSupportedOperatingSystem ::: " + supportedOperatingSystemMessage );
    }
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
    var localAppVersion = "0.0.0";
    var versions;
    var gitHubPath = "yafp/ttth";  // user/repo
    var url = "https://api.github.com/repos/" + gitHubPath + "/tags";

    writeLog("info", "searchUpdate ::: Start checking _" + url + "_ for available releases");

    var updateStatus = $.get( url, function( data )
    {
        timeout:3000; // in milliseconds

        // success
        versions = data.sort(function (v1, v2)
        {
            //return semver.compare(v2.name, v1.name);
        });

        // get remote version
        remoteAppVersionLatest = versions[0].name;
        //remoteAppVersionLatest = "66.6.6"; // overwrite variable to simulate available updates

        // get local version
        localAppVersion = require("electron").remote.app.getVersion();
        //localAppVersion = "1.0.0"; // to simulate

        writeLog("info", "searchUpdate ::: Local version: " + localAppVersion);
        writeLog("info", "searchUpdate ::: Latest public version: " + remoteAppVersionLatest);

        if( localAppVersion < remoteAppVersionLatest ) // Update available
        {
            writeLog("warn", "searchUpdate ::: Found update, notify user");
            showNoty("warning", "An update from <b>" + localAppVersion + "</b> to version <b>" + remoteAppVersionLatest + "</b> is available for <a href='https://github.com/yafp/ttth/releases' target='new'>download</a>.", 0);
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
        showNoty("error", "Checking <b>" + url + "</b> for available releases failed. Please troubleshoot your network connection.");
    })

    .always(function()
    {
        writeLog("info", "searchUpdate ::: Finished checking " + url + " for available releases");
    });
}


/**
* @name validateConfiguredDefaultView
* @summary Checks on startup if the service configured as default view is a valid / enabled service
* @description Checks if the default view is valid, otherwise fallbacks to settings view
*/
function validateConfiguredDefaultView()
{
    readLocalUserSetting("settingDefaultView");
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
        // V1: unread message handler: NO - &&  Link handler: NO
        //
        case "discord":
        case "dropbox":
        case "github":
        case "googleCalendar":
        case "googleContacts":
        case "googleDrive":
        case "googlePhotos":
        case "nextcloud":
            writeLog("info", "loadServiceSpecificCode ::: Executing " + serviceName + " specific things");
            eventListenerForSingleService(serviceId, false, false);
            break;

        // V2: unread-message-handler: NO - && - Link-handler: YES
        case "freenode":
        case "googleDuo":
        case "googleKeep":
        case "linkedIn":
        case "reddit":
        case "wechat":
        case "wire":
            writeLog("info", "loadServiceSpecificCode ::: Executing " + serviceName + " specific things");
            eventListenerForSingleService(serviceId, false, true);
            break;

        // V3: Unread-message-handler: YES - && - link handler: NO
        case "gitter":
        case "twitter":
        case "xing":
            writeLog("info", "loadServiceSpecificCode ::: Executing " + serviceName + " specific things");
            eventListenerForSingleService(serviceId, true, false);
            break;

        // V4: Unread-message-handler: YES && link-handler: YES
        case "googleMail":
        case "googleMessages":
        case "icq":
        case "mattermost":
        case "messenger":
        case "microsoftOutlook":
        case "microsoftOffice365":
        case "microsoftTeams":
        case "riot":
        case "slack":
        case "skype":
        case "steam":
        case "telegram":
        case "threema":
            writeLog("info", "loadServiceSpecificCode ::: Executing " + serviceName + " specific things");
            eventListenerForSingleService(serviceId, true, true);
            break;

        // Specialcase: WhatsApp
        case "whatsapp":
            writeLog("info", "loadServiceSpecificCode ::: Executing " + serviceName + " specific things");
            /*global serviceWhatsAppRegister*/
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
    const remote = require("electron").remote;
    const app = remote.app;
    const path = require("path");

    // empty the div
    $( "#settingsServicesConfigured" ).empty();

    // ensure we are reading from the correct location
    const defaultUserDataPath = app.getPath("userData");
    var customUserDataPath = path.join(defaultUserDataPath, "storage");
    storage.setDataPath(customUserDataPath);

    // read all user service configuration files
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
* @description Shows links to github informations. update informations. Initializes the service-checkboxes on loading the view.
*/
function initSettingsPage()
{
    // Start checking each single option
    //
    readLocalUserSetting("settingAutostart"); // Option: Autostart
    readLocalUserSetting("settingTheme"); // Option: Theme
    readLocalUserSetting("settingDisableTray"); // Option: DisableTray (Linux only)
    readLocalUserSetting("settingUrgentWindow"); // Option: Urgent Window

    // load all supported services to drop-down-list (used for adding new services)
    initAvailableServicesSelection();

    // show all user-configured services under "configured services"
    loadConfiguredUserServices();
}


/**
* @name removeServiceTab
* @summary Remove a single service tab from the UI
* @description Removes the li item from tab menu, removes the tab itself
* @param tabId
*/
function removeServiceTab(tabId)
{
    writeLog("info", "removeServiceTab ::: Starting to remove the tab: _" + tabId + "_.");

    // remove service nav-item from menu
    $("#menu_" + tabId).remove();
    writeLog("info", "removeServiceTab ::: Removed service nav item from navigation (_" + tabId + "_)");

    //  get webview
    //var webview = document.getElementById("webview_" + tabId);

    // remove webview listeners
    //webview.removeEventListener("ipc-message");

    // remove webview itself
    //webview.remove();
    //writeLog("info", "removeServiceTab ::: Removing the webview itself: _" + webview + "_.");

    // remove tabcontent from tab pane
    $("#" + tabId).remove();

    // remove service from select for DefaultView
    $("#selectDefaultView option[value=" + tabId + "]").remove();

    // reload the main window (see #117 - to avoid sending request to non-existing webviews)
    const {ipcRenderer} = require("electron");
    ipcRenderer.send("reloadMainWindow");

    writeLog("info", "removeServiceTab ::: Finished removing the tab: _" + tabId + "_.");
}


/**
* @name getHostName
* @summary Parsing the Hostname From a Url
* @description Parsing the Hostname From a Url
* @param url
*/
function getHostName(url)
{
    var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
    if ( match != null && match.length > 2 && typeof match[2] === "string" && match[2].length > 0 )
    {
        return match[2];
    }
    else
    {
        return null;
    }
}


/**
* @name getDomain
* @summary Parsing the Domain From a Url
* @description Parsing the Domain From a Url
* @param url
*/
function getDomain(url)
{
    var hostName = getHostName(url);
    var domain = hostName;

    if (hostName != null)
    {
        var parts = hostName.split(".").reverse();

        if (parts != null && parts.length > 1)
        {
            domain = parts[1] + "." + parts[0];

            if (hostName.toLowerCase().indexOf(".co.uk") !== -1 && parts.length > 2)
            {
                domain = parts[2] + "." + domain;
            }
        }
    }
    return domain;
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

    // Parsing url and extract domain for Persist-handling of webview
    var serviceDomain = getDomain(serviceUrl);


    // add new list item to unordner list (tabs/menu)
    //
    //$('#myTabs li:eq(' + newTabPosition + ')').after('<li class="nav-item small" id=menu_'+ serviceId +'><a class="nav-link ttth_nonSelectableText" id=target_' + serviceId +' href=#' + serviceId + ' role="tab" data-toggle="tab"><i class="' + serviceIcon +'"></i> ' + serviceName + ' <span id=badge_' + serviceId + ' class="badge badge-success"></span></a></li>');
    $("#myTabs li:eq(" + newTabPosition + ")").after("<li class='nav-item small' id=menu_"+ serviceId +"><a class='nav-link ttth_nonSelectableText' id=target_" + serviceId +" href=#" + serviceId + " role='tab' data-toggle='tab'><span id=shortcut_" + serviceId + " class='badge badge-pill badge-warning'></span> <i id=icon_"+ serviceId +" class='" + serviceIcon +"'></i> " + serviceName + " <span id=badge_" + serviceId + " class='badge badge-success'></span></a></li>");

    writeLog("info", "addServiceTab :::Added the navigation tab for service: _" + serviceId + "_.");

    // add the tab itself to #tabPanes
    //
    $( "#tabPanes" ).append( "<div role='tabpanel' class='tab-pane fade flex-fill ttth_resizer container-fluid' id=" + serviceId + "></div>" );
    writeLog("info", "addServiceTab :::Added the tab pane for service: _" + serviceId + "_.");

    // add webview  to new tab
    //
    // FIXME: right now all services are using a partition for persistent data - only Whatsapp not - as i get a Chrome 49+ needed error after enabling it.
    if(serviceType === "whatsapp")
    {
        // using no partition - thats plain stupid...
        $( "#"+ serviceId ).append( "<webview id=webview_" + serviceId + " class='ttth_resizer' src=" + serviceUrl + " preload="+ serviceInjectCode + " userAgent='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36'></webview>" );
    }
    else
    {
        // Using partition:
        if(serviceInjectCode === "") // no inject code
        {
            $( "#"+ serviceId ).append( "<webview id=webview_" + serviceId + " partition=persist:"+ serviceDomain + " class='ttth_resizer' src=" + serviceUrl + "></webview>" );
        }
        else // got injectCode, preload it
        {
            $( "#"+ serviceId ).append( "<webview id=webview_" + serviceId + " partition=persist:"+ serviceDomain + " class='ttth_resizer' src=" + serviceUrl + " preload="+ serviceInjectCode + "></webview>" );
        }
    }

    //writeLog("info", "addServiceTab ::: Added the webview to the tab pane for service: _" + serviceId + "_.");

    writeLog("info", "addServiceTab ::: Finished adding the tab: _" + serviceId + "_.");

    // add service to select for DefaultView
    $("#selectDefaultView").append(new Option(serviceName, serviceId));

    loadServiceSpecificCode(serviceId, serviceType);
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
    numberOfEnabledServices = numberOfEnabledServices - 1; // as the settings tab doesnt count

    // if there are configured services so far - delete all existing shortcuts
    if(numberOfEnabledServices > 0)
    {
        //ipcRenderer.send("deleteAllGlobalServicesShortcut", numberOfEnabledServices);
        ipcRenderer.send("deleteAllGlobalServicesShortcut", 9);
    }

    // Create new global shortcuts
    $("#myTabs li a").each(function()
    {
        currentTabId = $(this).attr("id");
        if(currentTabId === "target_Settings")
        {
           writeLog("info", "updateGlobalServicesShortcuts ::: Ignoring settings tab."); // Shortcut for settings tab is already hard-coded.
        }
        else // dynamic shortcuts for all services (well max. 9 - not all)
        {
            tabCounter = tabCounter +1;

            if(tabCounter < 10) // can't assign shortcuts > 9
            {
                ipcRenderer.send("createNewGlobalShortcut", "CmdOrCtrl+" + tabCounter, currentTabId); // create dynamic globalShortcut
            }
        }
    });

    writeLog("info", "updateGlobalServicesShortcuts ::: Finished updating global shortcuts for services");
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

    //const os = require("os");
    const storage = require("electron-json-storage");
    //const dataPath = storage.getDataPath();

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
        if( $("#bt_" + configuredUserServiceConfigName).attr("title") === "enabled") // is enabled - so disable it
        {
            // Status Button
            $("#bt_" + configuredUserServiceConfigName).removeClass(); // update button type by removing class and ...
            $("#bt_" + configuredUserServiceConfigName).addClass("btn btn-secondary btn-sm"); // update button type by adding a new class
            $("#bt_" + configuredUserServiceConfigName).prop("title", "disabled"); // update button title

            // update button icon
            $("#statusIconService_" + configuredUserServiceConfigName).removeClass();
            $("#statusIconService_" + configuredUserServiceConfigName).addClass("fas fa-toggle-off");

            // set serviceEnableStatus variable
            serviceEnableStatus = false;

            // remove service tab
            removeServiceTab(configuredUserServiceConfigName);

            writeLog("info", "settingsToggleEnableStatusOfSingleUserService ::: Service _" + configuredUserServiceConfigName + "_ is now disabled.");
            showNoty("success", "Disabled the service <b>" + configuredUserServiceConfigName + "</b>.");
        }
        else // is disabled - so enable it
        {
            // Status Button
            $("#bt_" + configuredUserServiceConfigName).removeClass(); // update button type by removing class and ...
            $("#bt_" + configuredUserServiceConfigName).addClass("btn btn-success btn-sm"); // update button type by adding a new class
            $("#bt_" + configuredUserServiceConfigName).prop("title", "enabled"); // update button title

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
    //var webview = document.getElementById("webview_" + serviceId);

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
    showNoty("success", "Successfully deleted the service <b>" + serviceId + "</b>.");

    // reload the main window
    const {ipcRenderer} = require("electron");
    ipcRenderer.send("reloadMainWindow");
}


/**
* @name settingsUserAddNewService
* @summary user wants to configure a new service
* @description user wants to configure a new service. Gets called from mainWindow.html
*/
function settingsUserAddNewService()
{
    writeLog("info", "settingsUserAddNewService ::: Starting to add a new user configured service.");

    //const os = require("os");
    //const dataPath = storage.getDataPath();
    const storage = require("electron-json-storage");

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
                        //serviceAllowsMultipleInstances = true;

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
                                        showNoty("error", "There is already a configured service of the type <b>" + userSelectedService + "</b>.", 0);
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
* @name localizeUserInterface
* @summary Localizes the user interface
* @description Is using i18next to localize the user interface. Translations are located in app/locales/.
*/
function localizeUserInterface()
{
    const isDev = require("electron-is-dev");

    // detect user language
    var userLang = navigator.language || navigator.userLanguage;

    // if the project is not packaged - overwrite the language ...
    if (isDev)
    {
        userLang = "en"; // to EN. This is used to ensure the screenshots are in the expected language
        //userLang = "pl"; // to PL. This is used to test unsupported languages
    }

    writeLog("info", "localizeUserInterface ::: Detected user language: " + userLang);

    var i18next = require("i18next");
    var Backend = require("i18next-sync-fs-backend");

    i18next
    .use(Backend)
    .init({
        debug: true, // logs info-level to console output. Helps finding issues with loading not working.
        lng: userLang, // configured user language
        whitelist: ["en", "de", "fr"], // supported languages
        fallbackLng: "en", // language to use if translations in user language are not available.
        ns: "translation", // string or array of namespaces to load
        defaultNS: "translation", // default namespace used if not passed to translation function
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
        // attribute: text
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

/**
* @name onAfterReadyMainWindow
* @summary Executed 1 sec after onReady code is executed
* @description This method is responsible for the second stage of loading & initializing.
*/
function onAfterReadyMainWindow()
{
    // call code here that you want to run after all $(document).ready() calls have run
    updateGlobalServicesShortcuts();

    // validate default view
    validateConfiguredDefaultView();

    // Configure click-handler for navigation/tabs
    $("#myTabs a").click(function (link)
    {
        var target = link.currentTarget.innerText;

        // remove leading space
        if(target.substr(0,1) === " ")
        {
            target = target.substr(1);
        }

        console.log("ready ::: Switched to tab: _" + target + "_.");

        // do page-specific things
        /*
        if(target === "Photos")
        {
            // needs a reload to display the webview properly
        }
        */
    });
}


/**
* @name checkNetworkConnectivityPeriodic
* @summary Periodically checks if network access exists or not
* @description Testmethod to inform the user when there is no access to the internet.
* @param timeInterval - The time interval which is used to start re-testing
*/
function checkNetworkConnectivityPeriodic(timeInterval)
{
    const isOnline = require("is-online"); // for online connectivity checks
    var continuousErrors = 0;
    var intervalID = setInterval(function()
    {
        (async () => {

        if(await isOnline() === true)
        {
            writeLog("info", "checkNetworkConnectivityPeriodic ::: Got access to the internet.");
            continuousErrors = 0; // reset counter
        }
        else
        {
            continuousErrors = continuousErrors + 1;
            if(continuousErrors === 3) // to avoid annoying notifications we report back only if the error happens X times in a row
            {
                showNoty("error", "Realizing connectivity issues, please troubleshoot your internet connection if this message appears.");
                continuousErrors = 0; // reset counter
            }
            writeLog("warn", "checkNetworkConnectivityPeriodic ::: Got NO access to the internet (" + continuousErrors +").");
        }
    })();

    }, timeInterval);
}






/**
* @name updateAllUserServiceConfigurations
* @summary Patches the user service configration files on version changes if needed.
* @description Patches the user service configration files on version changes if needed.
*/
function updateAllUserServiceConfigurations()
{
    // changes from 1.7.0 to 1.8.0:
    // - inject files got re-structured. Path & names are stored in the user-services configuration files
    //
    const storage = require("electron-json-storage");

    writeLog("info", "updateAllUserServiceConfigurations ::: Starting to validate all user service configurations");

    // loop over all json files - and see if we need to patch something
    storage.getAll(function(error, data)
    {
        if (error)
        {
            throw error;
        }

        // show object which contains all config files
        //writeLog("info", "loadEnabledUserServices ::: Object: " + data);
        //console.error(data);

        var shouldConfigBeUpdated = false;
        var newInjectCodePath;

        // loop over upper object
        for (var key in data)
        {
            if (data.hasOwnProperty(key))
            {
                writeLog("info", "updateAllUserServiceConfigurations ::: " + key + " -> " + data[key]);

                if(data[key]["injectCode"] !== "")
                {
                    switch (data[key]["injectCode"])
                    {
                        // gitter
                        case "./js/ttth/services/Gitter_inject.js":
                            newInjectCodePath = "./js/ttth/services/gitter/gitter_inject.js";
                            shouldConfigBeUpdated = true;
                            break;

                        // googleMail
                        case "./js/ttth/services/GoogleMail_inject.js":
                            newInjectCodePath = "./js/ttth/services/googleMail/googleMail_inject.js";
                            shouldConfigBeUpdated = true;
                            break;

                        // googleMessages
                        case "./js/ttth/services/GoogleMessages_inject.js":
                            newInjectCodePath = "./js/ttth/services/googleMessages/googleMessages_inject.js";
                            shouldConfigBeUpdated = true;
                            break;

                        // icq
                        case "./js/ttth/services/ICQ_inject.js":
                            newInjectCodePath = "./js/ttth/services/icq/icq_inject.js";
                            shouldConfigBeUpdated = true;
                            break;

                        // mattermost
                        case "./js/ttth/services/Mattermost_inject.js":
                            newInjectCodePath = "./js/ttth/services/mattermost/mattermost_inject.js";
                            shouldConfigBeUpdated = true;
                            break;

                        // messenger
                        case "./js/ttth/services/Messenger_inject.js":
                            newInjectCodePath = "./js/ttth/services/messenger/messenger_inject.js";
                            shouldConfigBeUpdated = true;
                            break;

                        // microsoftOffice365
                        case "./js/ttth/services/MicrosoftOffice365_inject.js":
                            newInjectCodePath = "./js/ttth/services/microsoftOffice365/microsoftOffice365_inject.js";
                            shouldConfigBeUpdated = true;
                            break;

                        // microsoftOutlook
                        case "./js/ttth/services/MicrosoftOutlook_inject.js":
                            newInjectCodePath = "./js/ttth/services/microsoftOoutlook/microsoftOutlook_inject.js";
                            shouldConfigBeUpdated = true;
                            break;

                        // microsoftTeams
                        case "./js/ttth/services/MicrosoftTeams_inject.js":
                            newInjectCodePath = "./js/ttth/services/microsoftTeams/microsoftTeams_inject.js";
                            shouldConfigBeUpdated = true;
                            break;

                        // Riot
                        case "./js/ttth/services/Riot_inject.js":
                            newInjectCodePath = "./js/ttth/services/riot/riot_inject.js";
                            shouldConfigBeUpdated = true;
                            break;

                        // skype
                        case "./js/ttth/services/Skype_inject.js":
                            newInjectCodePath = "./js/ttth/services/skype/skype_inject.js";
                            shouldConfigBeUpdated = true;
                            break;

                        // slack
                        case "./js/ttth/services/Slack_inject.js":
                            newInjectCodePath = "./js/ttth/services/slack/slack_inject.js";
                            shouldConfigBeUpdated = true;
                            break;

                        // steam
                        case "./js/ttth/services/SteamChat_inject.js":
                            newInjectCodePath = "./js/ttth/services/steam/steam_inject.js";
                            shouldConfigBeUpdated = true;
                            break;

                        // telegram
                        case "./js/ttth/services/Telegram_inject.js":
                            newInjectCodePath = "./js/ttth/services/telegram/telegram_inject.js";
                            shouldConfigBeUpdated = true;
                            break;

                        // threema
                        case "./js/ttth/services/Threema_inject.js":
                            newInjectCodePath = "./js/ttth/services/threema/threema_inject.js";
                            shouldConfigBeUpdated = true;
                            break;

                        // twitter
                        case "./js/ttth/services/Twitter_inject.js":
                            newInjectCodePath = "./js/ttth/services/twitter/twitter_inject.js";
                            shouldConfigBeUpdated = true;
                            break;

                         // whatsapp
                        case "./js/ttth/services/WhatsApp_inject.js":
                            newInjectCodePath = "./js/ttth/services/whatsapp/whatsapp_inject.js";
                            shouldConfigBeUpdated = true;
                            break;

                        // xing
                        case "./js/ttth/services/Xing.js":
                            newInjectCodePath = "./js/ttth/services/xing/xing_inject.js";
                            shouldConfigBeUpdated = true;
                            break;

                        default:
                            writeLog("info", "updateAllUserServiceConfigurations ::: Skipping to next service configuration");
                            newInjectCodePath = "";
                            shouldConfigBeUpdated = false;
                            break;
                    }
                }


                // Update this property - if needed
                if(shouldConfigBeUpdated === true)
                {
                    writeLog("info", "updateAllUserServiceConfigurations ::: Updating config of service: _" + key + "_.");

                    storage.set(key,
                    {
                        "type": data[key]["type"], // old value
                        "name": data[key]["name"], // old value
                        "icon": data[key]["icon"], // old value
                        "url": data[key]["url"], // old value
                        "injectCode": newInjectCodePath, // NEW VALUE
                        "serviceEnableStatus": data[key]["serviceEnableStatus"] // old value
                    }, function(error)
                    {
                        if (error) throw error;
                    });
                }
            }
        }
        writeLog("info", "updateAllUserServiceConfigurations ::: Finished.");
    });
}



/**
* @name onReadyMainWindow
* @summary Initialized the application after jquerys ready signal
* @description launcher for several init methods after jquerys ready signal. Gets called from mainWindow.html
*/
function onReadyMainWindow()
{
    // init the custom titlebar - see #115
    initTitlebar();

    // update the configured UserServices (introduced with switch from 1.7.0 to 1.8.0)
    updateAllUserServiceConfigurations();

    // load the configured user services
    loadEnabledUserServices();

    // init the settings tab
    initSettingsPage();

    // check operating system
    checkSupportedOperatingSystem();

    // check for updates
    searchUpdate();

    // Translate using i18next
    localizeUserInterface();

    // start periodic network checker
    checkNetworkConnectivityPeriodic(10000); // 10.000 milliseconds = 10 seconds

    // execute some things later ...
    setTimeout(function()
    {
        onAfterReadyMainWindow();
    }, 1000);
}



// ----------------------------------------------------------------------------
// ipcRenderer things
// ----------------------------------------------------------------------------


// Call from main.js ::: reloadCurrentService
//
require("electron").ipcRenderer.on("reloadCurrentService", function()
{
    // get href of current active tab
    var tabValue = $(".nav-tabs .active").attr("href");
    tabValue = tabValue.substring(1); // cut the first char ( =  #)

    if (tabValue !== "Settings")
    {
        writeLog("info", "reloadCurrentService ::: Current active tab is: " + tabValue);

        showNoty("info", "Trying to reload the current service: <b>" + tabValue + "</b>.");

        // Start animating
        doAnimateServiceIcon(true, tabValue);

        // get configured target url & inject code from config
        const storage = require("electron-json-storage");
        storage.get(tabValue, function(error, data)
        {
            if (error)
            {
                throw error;
            }

            var url =  data.url;

            if (typeof url === "undefined") // Sentry: TTTH-3S
            {
                // url is undefined
                showNoty("error", "Trying to reload service: <b>" + tabValue + "</b> failed, as URL is undefined.", 0);
                writeLog("error", "reloadCurrentService ::: Reloading current active service: " + tabValue + " failed, as its URL is undefined.");
            }
            else
            {
                writeLog("info", "reloadCurrentService ::: Set service  _" + tabValue + "_ URL of webview to: _" + url + "_.");
                document.getElementById( "webview_" + tabValue ).loadURL(url);
            }

            // TODO
            // inject code
            //var injectCode = data.injectCode;
        });
    }
});


// Call from main.js ::: showSettings
//
require("electron").ipcRenderer.on("showSettings", function()
{
    writeLog("info", "showSettings ::: Switching to Settings tab");
    switchToService("Settings");
});


// Call from main.js ::: startSearchUpdates
//
require("electron").ipcRenderer.on("startSearchUpdates", function()
{
    writeLog("info", "startSearchUpdates ::: Show update information div");
    searchUpdate(false); // silent = false. Forces result feedback, even if no update is available
});


// Call from main.js ::: openDevToolForCurrentService
//
require("electron").ipcRenderer.on("openDevToolForCurrentService", function()
{
    // get href of current active tab
    var tabValue = $(".nav-tabs .active").attr("href");
    tabValue = tabValue.substring(1); // cut the first char ( =  #)

    if(tabValue === "Settings") // This makes no sense on the settings tab
    {
        showNoty("info", "This function is supposed to be used on service tabs, not the settings tab.");
    }
    else // default case
    {
        writeLog("info", "openDevToolForCurrentService ::: Trying to open DevTools for current service: _" + tabValue + "_.");

        // get webview
        var webview = document.getElementById("webview_" + tabValue);

        // Open devTools
        webview.openDevTools();
    }
});


// Call from main.js ::: nextTab
//
require("electron").ipcRenderer.on("nextTab", function()
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
    switchToService(serviceName); // jump to next tab
});


// Call from main.js ::: previousTab
//
require("electron").ipcRenderer.on("previousTab", function()
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
    switchToService(serviceName); // jump to previous tab
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

                previewIcon(); // preview the icon
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

        previewIcon(); // preview the icon

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
require("electron").ipcRenderer.on("showNoConnectivityError", function()
{
    writeLog("error", "showNoConnectivityError ::: There is no internet connection.");
    showNoty("error", "No access to the internet (critical) ", 0);
});
