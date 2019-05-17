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
        serviceName = ttthAvailableServices[i].toLowerCase();

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
    /* var path = require("path"); */

    let myNotification = new Notification("ttth ::: " + title, {
        body: message,
        icon: "img/notification/64x64.png"
    });

    /*
    myNotification.onclick = () => {
        console.log("Notification clicked")
    }
    */
}


/**
* @name toggleSettingAutostart
* @summary Enables or disables the autostart
* @description Enables or disables the autostart
*/
function toggleSettingAutostart()
{
    console.log("toggleSettingAutostart ::: Start");

    // auto-launch - via: https://www.npmjs.com/package/auto-launch
    var AutoLaunch = require("auto-launch");

    var ttthAutoLauncher = new AutoLaunch({
        name: "ttth",
    });

    if($("#checkboxSettingAutostart").prop("checked"))
    {
        ttthAutoLauncher.enable();

        writeLocalStorage("settingAutostart", true);

        console.log("toggleSettingAutostart ::: Finished enabling Autostart");

    }
    else
    {
        ttthAutoLauncher.disable();

        writeLocalStorage("settingAutostart", false);
        writeLocalStorage("settingAutostartMinimized", false);

        // adjust UI
        //
        // make sure check checkfor for  AutostartStartMinimized is unchecked as well
        $("#checkboxSettingAutostartMinimized").prop("checked", false);

        console.log("toggleSettingAutostart ::: Finished disabling Autostart");

    }

    console.log("toggleSettingAutostart ::: End");
}




/**
* @name toggleSettingAutostartMinimized
* @summary Enables or disables the autostart minimized
* @description Enables or disables the autostart minimized
*/
function toggleSettingAutostartMinimized()
{
    console.log("toggleSettingAutostartMinimized ::: Start");

    // auto-launch - via: https://www.npmjs.com/package/auto-launch
    var AutoLaunch = require("auto-launch");


    if($("#checkboxSettingAutostartMinimized").prop("checked"))
    {
        // enable start minimized
        var ttthAutoLauncher = new AutoLaunch({
        name: "ttth",
        isHidden: true
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

        console.log("toggleSettingAutostartMinimized ::: Finished enabling minimized Autostart");

    }
    else
    {
        // disable start minimized
        var ttthAutoLauncher = new AutoLaunch({
        name: "ttth",
        isHidden: false
        });

        // Write AutostartMinimized to local storage
        writeLocalStorage("settingAutostartMinimized", false);

        

        ttthAutoLauncher.enable();

        console.log("toggleSettingAutostartMinimized ::: Finished disabling minimized Autostart");
    }

    console.log("toggleSettingAutostartMinimized ::: End");
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
    sendNotification("Updated Settings", "Default view is now configured to load " + newDefaultView + " on startup.");

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
    sendNotification("Updated Settings", "Default view on startup is now set back to defaults (Settings).");

    console.log("settingDefaultViewReset ::: Start");
}


/**
* @name checkSupportedOperatingSystem
* @summary Checks if the operating system is supported or not
* @description Checks if the operating system is linux. Everything else is untested so far.
*/
function checkSupportedOperatingSystem()
{
    console.log("checkSupportedOperatingSystem ::: Start");

    var tttModalSubject = "";
    var ttthModalMessage = "";
    var userPlatform = process.platform;

    console.log("checkSupportedOperatingSystem ::: Detected operating system as: " + userPlatform);

    switch(userPlatform)
    {
        case "linux":
            console.log("checkSupportedOperatingSystem ::: Operating system " + userPlatform + " is fine." );

            // hide OS information
            $("#operatingSystemInformation").hide();

            break;

        case "win32":
        case "windows":
            // define subject & message
            tttModalSubject = "Warning";
            ttthModalMessage = "Support for " + userPlatform + " is experimental.";

            /*
            // update the modal
            $( ".modalSubject" ).append( tttModalSubject );
            $( ".modalMessage" ).append( "<p>" + userPlatform + " " + ttthModalMessage + "</p>" );

            // show the modal
            $("#myModal").modal("show");
            */

            // update the OS-text
            $("#operatingSystemInformation").html(ttthModalMessage);

            // change class
            $("#operatingSystemInformation").attr("class", "alert alert-warning");

            // show OS information
            $("#operatingSystemInformation").show();

            console.warn("checkSupportedOperatingSystem ::: Operating system " + userPlatform + " " + ttthModalMessage );

            break;

        default:
            // define subjexct & message
            tttModalSubject = "Error";
            ttthModalMessage = "Support for " + userPlatform + " is experimental.";

            /*
            // update the modal
            $( ".modalSubject" ).append( tttModalSubject );
            $( ".modalMessage" ).append( "<p>" + userPlatform + " " + ttthModalMessage + "</p>" );

            // show the modal
            $("#myModal").modal("show");
            */

            // update the os-info text
            $("#operatingSystemInformation").html(ttthModalMessage);

            // change class
            $("#operatingSystemInformation").attr("class", "alert alert-danger");

            // show os information
            $("#operatingSystemInformation").show();

            console.error("checkSupportedOperatingSystem ::: Operating system " + userPlatform + " " + ttthModalMessage );
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
    console.log("switchToService ::: Loading: " + serviceName.toLowerCase());

    // activate the related tab
    $("#target_" + serviceName.toLowerCase()).trigger("click");

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
        timeout:3000 // in milliseconds 

        // success
        //
        var versions = data.sort(function (v1, v2)
        {
            return semver.compare(v2.name, v1.name);
        });

        // remote version
        var remoteAppVersionLatest = versions[0].name;

        // local version
        var localAppVersion = require("electron").remote.app.getVersion();

        console.log("searchUpdate ::: Local version: " + localAppVersion);
        console.log("searchUpdate ::: Latest public version: " + remoteAppVersionLatest);

        if( localAppVersion < remoteAppVersionLatest )
        {
            console.warn("searchUpdate ::: Found update, notify user");

            // update the updater-info text
            $("#updateInformation").html('ttth ' + remoteAppVersionLatest + ' is now available. See <a href="#" onClick=\'openURL("https://github.com/yafp/ttth/blob/master/CHANGELOG.md")\'>Changelog</a> for details. Download is available <a href="#" onClick=\'openURL("https://github.com/yafp/ttth/releases")\'>here</a>.');

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
        //alert( "searchUpdate ::: done" );
        //console.log("searchUpdate ::: Successfully checked " + url + " for available releases");
    })

    .fail(function() 
    {
        //alert( "searchUpdate ::: fail" );
        console.error("searchUpdate ::: Checking " + url + " for available releases failed.");

        $("#updateInformation").hide();
    })

    .always(function() 
    {
        //alert( "always" );
        console.log("searchUpdate ::: Finished checking " + url + " for available releases");
    });
 
    console.log("searchUpdate ::: End");
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
        case "GoogleMail":
            console.log("loadServiceSpecificCode ::: Executing " + serviceName + " specific things");
            googlemailStart();
            break;

        case "Mattermost":
            console.log("loadServiceSpecificCode ::: Executing " + serviceName + " specific things");
            mattermostStart();
            break;

         case "Slack":
            console.log("loadServiceSpecificCode ::: Executing " + serviceName + " specific things");
            slackStart();
            break;

        case "Telegram":
            console.log("loadServiceSpecificCode ::: Executing " + serviceName + " specific things");
            telegramStart();
            break;

        case "Threema":
            console.log("loadServiceSpecificCode ::: Executing " + serviceName + " specific things");
            threemaStart();
            break;

        case "WhatsApp":
            console.log("loadServiceSpecificCode ::: Executing " + serviceName + " specific things");
            serviceWhatsAppAddEventListener();
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
            label: "Please insert your mattermost server URL",
            value: "https://mattermost.example.org",
            inputAttrs: {
                type: "url"
            },
            icon: "img/icon/64x64.png"
        })
        .then((r) => {
            if(r === null) {
                console.log("initMattermost ::: User cancelled the URL dialog.");
                
                // hide tab
                $("#menu_mattermost").hide();

                // uncheck service checkbox
                $("#Mattermost").prop("checked", false);

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

        // show custom url in services-list
        //$('#label_Mattermost').val($('#label_Mattermost').val() + ' (url: ' + mattermostUrl + ')');

        // adjust title
        $('#label_Mattermost').prop('title', mattermostUrl);

    }

    console.log("initMattermost ::: End");
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

    // check if objectName is a valid service name
    // if so it should exists in the array: ttthAvailableServices
    var arrayPosition = ttthAvailableServices.indexOf(objectName);
    var objectNameIsValid = (ttthAvailableServices.indexOf(objectName) > -1);

    if(objectNameIsValid === true)
    {
        if($("#" + objectName).prop("checked"))
        {
            console.log("toggleCheckbox ::: Activating " + objectName);

            // write to local storage
            writeLocalStorage(objectName, "true");

            // show service in menu
            $("#menu_"+objectName.toLowerCase()).show();

            // add option to DefaultView select
            $("#selectDefaultView").append(new Option(objectName, objectName));

            // update status button
            $("#bt_" + objectName).attr("class", "btn btn-success btn-sm");
            $("#bt_" + objectName).attr("title", "enabled");

            // update webview src
            document.getElementById( objectName + "Webview" ).setAttribute( "src", ttthServicesUrls[arrayPosition]);
            console.log("toggleCheckbox ::: webview src of service: " + objectName + " is now: " + ttthServicesUrls[arrayPosition]);

            // check if there is service-specific code to load
            loadServiceSpecificCode(objectName);

            // send notification
            sendNotification("Service activation", "Activated the service <b>" + objectName + "</b>");


            // Hackery: Mattermost is different - as it has a user-specific URL
            //
            if( objectName === "Mattermost" )
            {
                initMattermost();
            }


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
            $("#bt_" + objectName).attr("class", "btn btn-danger btn-sm");
            $("#bt_" + objectName).attr("title", "disabled");

            // update webview src
            document.getElementById( objectName + "Webview" ).setAttribute( "src", "");
            console.log("toggleCheckbox ::: webview src of service: " + objectName + " is now empty");

            // send notification
            sendNotification("Service deactivation", "Deactivated the service <b>" + objectName + "</b>");

            // Hackery: Mattermost is different - as it has a user-specific URL
            //
            if( objectName === "Mattermost" )
            {
                // delete local storage key and its related value
                localStorage.removeItem("serviceMattermostUrl");

                // adjust service label back to default
                //$('#label_Mattermost').val("Mattermost");
                $("#label_Mattermost").prop("title", "");

            }
        }

        validateConfiguredDefaultView();

    }
    else
    {
        console.warn("toggleCheckbox ::: Got an invalid objectName: " + objectName);
    }

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
    //var appName = require("electron").remote.app.getName();
    var serviceName;
    var curSettingAutostart;

    // show appname and version
    $( "#settingsAppVersion" ).html( appVersion );


    console.log("initSettingsPage ::: Load all services and its status to the settings interface");

    // loop over array ttthAvailableServices which contains all service-names
    //
    var arrayLength = ttthAvailableServices.length;
    for (var i = 0; i < arrayLength; i++)
    {
        serviceName =  ttthAvailableServices[i];
        serviceUrl = ttthServicesUrls[i];

        console.log("initSettingsPage ::: Checking status of service: " + serviceName);

        // Add service to settings page
        //
        //$( "#settingsAvailableServices" ).append('<div class="input-group input-group-sm mb-1"><div class="input-group-prepend"><div class="input-group-text"><input type="checkbox" id=' + ttthAvailableServices[i] + ' name=' + ttthAvailableServices[i] + ' onClick="toggleCheckbox(\''  + ttthAvailableServices[i]+ '\');"></div></div><input type="text" class="form-control" aria-label="Text input with checkbox" value='+ ttthAvailableServices[i] +'  disabled><div class="input-group-prepend"><button type="button" class="btn btn-danger btn-sm" id="bt_'+ttthAvailableServices[i] +'" title="disabled" disabled></button></div></div>');
        //
        $( "#settingsAvailableServices" ).append('<div class="input-group input-group-sm mb-1"><div class="input-group-prepend"><div class="input-group-text"><input type="checkbox" id=' + serviceName + ' name=' + serviceName + ' onClick="toggleCheckbox(\''  + serviceName + '\');"></div></div><input type="text" class="form-control" id="label_' + serviceName + '" aria-label="Text input with checkbox" value='+ serviceName +' title=' + serviceUrl + ' disabled><div class="input-group-prepend"><button type="button" class="btn btn-danger btn-sm" id="bt_'+ serviceName +'" title="disabled" disabled></button></div></div>');


        // Show activated services as enabled in settings
        // add them to the default view select item
        // uand pdate the related status button
        var curServiceStatus = readLocalStorage(serviceName);
        if(curServiceStatus === "true")
        {
            console.log("initSettingsPage ::: Service: " + serviceName + " is activated");

            // check the checkbox
            $("#" + serviceName).prop("checked", true);

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
    

    // Setting: DefaultView
    //
    // Change defaultView select item to select2 item
    //$('#selectDefaultView').select2();
    //
    // now validate the optional configured default view
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


    console.log("initSettingsPage ::: End");
}


/**
* @name initMenu
* @summary Init the menu / navigation on app launch
* @description Checks which services are enabled and shows or hides the related tabs from navigation
*/
function initMenu()
{
    console.log("initMenu ::: Start");

    var serviceName;

    // loop over array ttthAvailableServices
    var arrayLength = ttthAvailableServices.length;
    for (var i = 0; i < arrayLength; i++)
    {
        serviceName = ttthAvailableServices[i];

        console.log("initMenu ::: Checking status of service: " + serviceName);

        var curServiceStatus = readLocalStorage(serviceName);

        if(curServiceStatus === "true")
        {
            console.log("initMenu ::: Activating " + serviceName );

            // show service in menu
            $("#menu_" + serviceName.toLowerCase()).show();
        }
        else
        {
            console.log("initMenu ::: Deactivating " + serviceName);

            // hide service from menu
            $("#menu_" + serviceName.toLowerCase()).hide();
        }
    }

    console.log("initMenu ::: End");
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

  // should try to detect the user language
  // and then set the related lang if available
  var LanguageDetector = require("i18next-electron-language-detector");

  i18next
  .use(Backend)
  .use(LanguageDetector)
  .init({
    debug: true,
    whitelist: ["en", "de"],
    lng: userLang,
    fallbackLng: "en",
    ns: "translation",
    defaultNS: "translation",
    updateMissing: false,
    initImmediate: true,
    backend: {
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
