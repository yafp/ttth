/**
* @file Contains all renderer code
* @author yafp
* @namespace renderer
*/

'use strict'

// ----------------------------------------------------------------------------
// IMPORT TTTH MODULES
// ----------------------------------------------------------------------------
const utils = require('./js/ttth/modules/utils.js')
const uscu = require('./js/ttth/modules/userServiceConfigUpdater.js')
// const crash = require('./js/ttth/modules/crashReporter.js') // crashReporter
const sentry = require('./js/ttth/modules/sentry.js') // sentry
const unhandled = require('./js/ttth/modules/unhandled.js') // electron-unhandled

// ----------------------------------------------------------------------------
// VARIABLES
// ----------------------------------------------------------------------------
let myTitlebar
var customTitlebar = require('custom-electron-titlebar')

// const appWideUserAgentDefault = 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:70.0) Gecko/20100101 Firefox/70.0'
const appWideUserAgentDefault = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) ttth Chrome/78.0.3904.130 Electron/7.1.8 Safari/537.36' // default agent

// ----------------------------------------------------------------------------
// INIT ERROR HANDLING
// ----------------------------------------------------------------------------
// crash.initCrashReporter()
// unhandled.initUnhandled()

// Test by calling a not existing function
// myUndefinedFunctionFromRenderer()

// myUndefinedFunctionFromRenderer();

// -----------------------------------------------------------------------------
// FUNCTIONS
// -----------------------------------------------------------------------------

/**
* @function titlebarInit
* @summary Init the titlebar for the frameless mainWindow
* @description Creates a custom titlebar for the mainWindow using custom-electron-titlebar (https://github.com/AlexTorresSk/custom-electron-titlebar).
* @memberof renderer
*/
function titlebarInit () {
    //var customTitlebar = require('custom-electron-titlebar')

    myTitlebar = new customTitlebar.Titlebar({
        titleHorizontalAlignment: 'center', // position of window title
        icon: 'img/titlebar/icon_titlebar.png',
        drag: true, // whether or not you can drag the window by holding the click on the title bar.
        backgroundColor: customTitlebar.Color.fromHex('#171717'),
        // backgroundColor: customTitlebar.Color.fromHex(newColor),
        minimizable: true,
        maximizable: true,
        closeable: true,
        unfocusEffect: false,
        itemBackgroundColor: customTitlebar.Color.fromHex('#525252') // hover color
    })

    // font size of custom-titlebar is set in /app/css/ttth/mainWindow.css
}

/**
* @function titlebarUpdateBackground
* @summary Update the color of the custom titlebar
* @description Update the color of the custom titlebar
* @memberof renderer
* @param {string} newColor - A hex color string
*/
function titlebarUpdateBackground (newColor) {
    myTitlebar.updateBackground(customTitlebar.Color.fromHex(newColor))
    utils.writeConsoleMsg('info', 'titlebarUpdateBackground ::: Updated the titlebar background')
}


/**
* @function titlebarUpdateItemBackGroundOnHover
* @summary Update the item background color of the custom titlebar
* @description Update the item background color of the custom titlebar
* @memberof renderer
* @param {string} newColor - A hex color string
*/
function titlebarUpdateItemBackgroundOnHover(newColor) {
    myTitlebar.updateItemBGColor(customTitlebar.Color.fromHex(newColor))
    utils.writeConsoleMsg('info', 'titlebarUpdateItemBackgroundOnHover ::: Updated the item background on hover')
}

/**
* @function titlebarDispose
* @summary Removes the custom titlbar
* @description Removes the custom titlbar. Shouldnt be used - as the UI looks broken then.
* @memberof renderer
*/
function titlebarDispose () {
    myTitlebar.dispose()
    utils.writeConsoleMsg('warn', 'titlebarDispose ::: Disposed the entire titlebar')
}

/**
* @function switchToService
* @summary Activates a given service tab
* @description Activates the tab of a given service. Needed for handling DefaultView setting.
* @memberof renderer
* @param {string} serviceName - Name of the service
*/
function switchToService (serviceName) {
    $('#target_' + serviceName).trigger('click') // activate the related tab
    utils.writeConsoleMsg('info', 'switchToService ::: Switched to tab: _' + serviceName + '_.')
}

/**
* @function writeLocalUserSetting
* @summary Write to electron-json-storage
* @description Writes a value for a given key to electron-json-storage
* @memberof renderer
* @param {string} key - Name of storage key
* @param {string} value - New value
*/
function writeLocalUserSetting (key, value) {
    const storage = require('electron-json-storage')
    const remote = require('electron').remote
    const app = remote.app
    const path = require('path')

    const defaultDataPath = storage.getDefaultDataPath() // get default storage path
    const userSettingsPath = path.join(app.getPath('userData'), 'ttthUserSettings') // set new path for userUsettings
    storage.setDataPath(userSettingsPath)

    // write the user setting
    storage.set(key, { setting: value }, function (error) {
        if (error) {
            utils.writeConsoleMsg('error', 'writeLocalUserSetting ::: Got an error while trying to write a user setting with key: _' + key + '_ and value: _' + value + '_. Error: ' + error)
            throw error
        }
        utils.writeConsoleMsg('info', 'writeLocalUserSetting ::: key: _' + key + '_ - new value: _' + value + '_')
        storage.setDataPath(defaultDataPath) // revert to default path
    })
}

/**
* @function loadDefaultView
* @summary Loads the default view
* @description Loads the default view. This is used on load of the .html
* @memberof renderer
* @param {string} newDefaultView - the view which is defined as default view
*/
function loadDefaultView (newDefaultView) {
    utils.writeConsoleMsg('info', 'loadDefaultView ::: Found configured default view: _' + newDefaultView + '_.')
    switchToService(newDefaultView)
}

/**
* @function settingDefaultViewReset
* @summary Reset the stored default view
* @description Deletes the localstorage key 'settingDefaultview'
* @memberof renderer
*/
function settingDefaultViewReset () {
    writeLocalUserSetting('settingDefaultView', false)
    $('#selectDefaultView').prop('selectedIndex', 0) // reset the selection of the select item
    utils.writeConsoleMsg('info', 'settingDefaultViewReset ::: Did reset the default view')
}

/**
* @function settingActivateUserColorCss
* @summary Activates a css style
* @description Activates a css style / theme
* @memberof renderer
* @param {string} cssStyleName - Name of the css file
*/
function settingActivateUserColorCss (cssFile) {
    utils.writeConsoleMsg('info', 'settingActivateUserColorCss ::: Loading css file: _' + cssFile + '_.')

    // load custom css file
    //
    $('<link/>', {
        rel: 'stylesheet',
        type: 'text/css',
        href: 'css/ttth/themes/' + cssFile
    }).appendTo('head')

    // update color of custom-titlebar - see #156
    //
    var titlebarBackGroundColor
    var titlebarItemBackGroundColor
    switch (cssFile) {
    case 'mainWindow_dark.css':
        titlebarBackGroundColor = '#171717'
        titlebarItemBackGroundColor = '#FFFFFF'
        break

    case 'mainWindow_default.css':
        titlebarBackGroundColor = '#171717'
        titlebarItemBackGroundColor = '#FFFFFF'
        break

    case 'mainWindow_dracula.css':
        titlebarBackGroundColor = '#282a36'
        titlebarItemBackGroundColor = '#FFFFFF'
        break

    case 'mainWindow_nord.css':
        titlebarBackGroundColor = '#5e81ac'
        titlebarItemBackGroundColor = '#FFFFFF'
        break

    case 'mainWindow_snazzy.css':
        titlebarBackGroundColor = '#1a1c24'
        titlebarItemBackGroundColor = '#FFFFFF'
        break

    case 'mainWindow_solarized_dark.css':
        titlebarBackGroundColor = '#002b36'
        titlebarItemBackGroundColor = '#FFFFFF'
        break

    case 'mainWindow_solarized_light.css':
        titlebarBackGroundColor = '#eee8d5'
        titlebarItemBackGroundColor = '#FFFFFF'
        break

    default:
        titlebarBackGroundColor = '#171717'
        titlebarItemBackGroundColor = '#FFFFFF'
    }

    titlebarUpdateBackground(titlebarBackGroundColor) // update the titlebar
    //titlebarUpdateItemBackgroundOnHover(titlebarItemBackGroundColor) // update the hover color for menu-items
}

/**
* @function settingThemeUpdate
* @summary Updates which theme is selected
* @description Sets the new theme and activates a css style / theme
* @memberof renderer
*/
function settingThemeUpdate () {
    // get values from theme select
    var currentSelectedTheme = $('#selectTheme').val() // id of selected theme
    var currentSelectedThemeDisplayName = $('#selectTheme option:selected').text() // displayed theme name

    settingActivateUserColorCss(currentSelectedTheme) // activate the theme
    writeLocalUserSetting('settingTheme', currentSelectedTheme) // write Setting
    utils.showNoty('success', "<i class='fas fa-toggle-on'></i> <b>Option:</b> <u>Theme</u> changed to " + currentSelectedThemeDisplayName + '.') // noty
    utils.writeConsoleMsg('info', 'settingThemeUpdate ::: Updating user selected css file to: _' + currentSelectedTheme + '_.') // log
}

/**
* @function settingThemeReset
* @summary Resets the selected theme back to default
* @description Sets the new theme and activates a css style / theme
* @memberof renderer
*/
function settingThemeReset () {
    $('#selectTheme').prop('selectedIndex', 0) // reset the selection of the select item back to default
    var currentSelectedTheme = 'mainWindow_default.css'

    settingActivateUserColorCss(currentSelectedTheme) // load default theme
    writeLocalUserSetting('settingTheme', currentSelectedTheme) // write setting
    utils.showNoty('success', "<i class='fas fa-toggle-on'></i> Changed <b>Option:</b> <u>Theme</u> back to default.") // noty
    utils.writeConsoleMsg('info', 'settingThemeReset ::: Resetting user selected css file back to default: _' + currentSelectedTheme + '_.') // log
}

/**
* @function readLocalUserSetting
* @summary Read from local storage
* @description Reads a value stored in local storage (for a given key)
* @memberof renderer
* @param {string} key - Name of local storage key
* @param {boolean} [optional] - Boolean used for an ugly hack
*/
function readLocalUserSetting (key, optional = false) {
    const storage = require('electron-json-storage')
    const remote = require('electron').remote
    const app = remote.app
    const path = require('path')

    utils.writeConsoleMsg('info', 'readLocalUserSetting ::: Trying to read value of key: ' + key)

    const defaultDataPath = storage.getDefaultDataPath() // get default storage path
    const userSettingsPath = path.join(app.getPath('userData'), 'ttthUserSettings') // change path for userSettings
    storage.setDataPath(userSettingsPath)

    // read the json file
    storage.get(key, function (error, data) {
        if (error) {
            utils.writeConsoleMsg('error', 'readLocalUserSetting ::: Got error while reading a json file with the name: _' + key + '_. Error: ' + error)
            throw error
        }

        var value = data.setting // store the read value in a variable

        utils.writeConsoleMsg('info', 'readLocalUserSetting ::: key: _' + key + '_ - got value: _' + value + '_')
        storage.setDataPath(defaultDataPath) // revert storage path

        // setting DefaultView
        if (key === 'settingDefaultView') {
            // no default view configured
            if (value === null) {
                utils.writeConsoleMsg('info', 'validateConfiguredDefaultView ::: No default configured - Stay on settings-view')
            } else {
                utils.writeConsoleMsg('info', 'validateConfiguredDefaultView ::: Found configured default view: ' + value)

                // check if the configured service is enabled or not
                var exists = false
                utils.writeConsoleMsg('info', 'validateConfiguredDefaultView ::: Check if configured default view is an enabled service or not')
                // Check if Dropdown contains the defined default view as enabled service
                $('#selectDefaultView option').each(function () {
                    if (this.value === value) {
                        exists = true
                        return false
                    }
                })

                // if it exists
                if (exists) {
                    utils.writeConsoleMsg('info', 'validateConfiguredDefaultView ::: Configured default view is valid')
                    $('#selectDefaultView').val(value) // Update UI select
                    loadDefaultView(value) // load the default view
                } else {
                    utils.writeConsoleMsg('warning', 'validateConfiguredDefaultView ::: Fallback to default (setting-view)')
                    $('#selectDefaultView').prop('selectedIndex', 0) // reset the selection of the select item
                    settingDefaultViewReset() // delete the localstorage entry for defaultview
                }
            }
        }

        // Setting Theme
        //
        if (key === 'settingTheme') {
            utils.writeConsoleMsg('info', 'initSettingsPage ::: Setting Theme is configured to: _' + value + '_.')

            if ((value === null) | (value === 'undefined') | (value === undefined)) { // see #154
                utils.writeConsoleMsg('warn', 'initSettingsPage ::: Setting Theme is undefined - going to fallback to default theme.')
                writeLocalUserSetting('settingTheme', 'mainWindow_default.css') // introduced with #154
                settingActivateUserColorCss('mainWindow_default.css') // fallback to default
            } else {
                settingActivateUserColorCss(value)
                $('#selectTheme').val(value) // Update UI select
            }
        }
        // End: Theme

        // Setting Autostart
        //
        if (key === 'settingAutostart') {
            if (value === true) {
                utils.writeConsoleMsg('info', 'initSettingsPage ::: Setting Autostart is configured')
                $('#checkboxSettingAutostart').prop('checked', true)
            } else {
                utils.writeConsoleMsg('info', 'initSettingsPage ::: Setting Autostart is not configured')
                $('#checkboxSettingAutostart').prop('checked', false)
            }
        }
        // End: Autostart

        // Setting DisableTray
        //
        if (key === 'settingDisableTray') {
            if (utils.isLinux()) {
                if (value === true) {
                    const { ipcRenderer } = require('electron')
                    utils.writeConsoleMsg('info', 'initSettingsPage ::: Setting DisableTray is configured')
                    $('#checkboxSettingDisableTray').prop('checked', true)
                    ipcRenderer.send('disableTray')
                }
            } else {
                // hide the entire setting on settingspage
                $('#settingsSectionDisableTray').hide()
            }
        }
        // End DisableTRay

        // Setting Urgent Window - #110
        if (key === 'settingUrgentWindow') {
            if (value === true) {
                const { ipcRenderer } = require('electron')
                $('#checkboxSettingUrgentWindow').prop('checked', true)
                if (optional === true) {
                    ipcRenderer.send('makeWindowUrgent')
                }
                utils.writeConsoleMsg('info', 'initSettingsPage ::: Setting UrgentWindow is enabled')
            }
        }
        // End: Urgent Window

        // Setting: ErrorReporting
        if (key === 'settingEnableErrorReporting') {
            if (value === false) {
                $('#checkboxSettingErrorReporting').prop('checked', false)
                sentry.disableSentry()
                utils.writeConsoleMsg('info', 'initSettingsPage ::: Setting ErrorReporting is disabled')
            } else {
                $('#checkboxSettingErrorReporting').prop('checked', true)
                sentry.enableSentry()
                utils.writeConsoleMsg('info', 'initSettingsPage ::: Setting ErrorReporting is enabled')
            }

            // there is no config yet - create one
            if (value === undefined) {
                writeLocalUserSetting('settingEnableErrorReporting', true)
            }
        }
        // End: ErrorReporting
    })
}

/**
* @function previewIcon
* @summary Generates a preview of the icon in the config-window
* @description Reads the content of the icon field and tries to show/preview the resulting FontAwesome icon
* @memberof renderer
*/
function previewIcon () {
    var currentIconCode = $('#input_serviceIcon').val() // get content of field
    $('#previewIcon').html("<i class='" + currentIconCode + " fa-lg'></i>") // try to load font-awesome icon
}

/**
* @function settingToggleDisableTray
* @summary Enables or disabled the Tray
* @description Updates the settings / option DisableTray
* @memberof renderer
*/
function settingToggleDisableTray () {
    const { ipcRenderer } = require('electron')

    // Handle depending on the checkbox state
    if ($('#checkboxSettingDisableTray').prop('checked')) {
        ipcRenderer.send('disableTray')
        writeLocalUserSetting('settingDisableTray', true)
        utils.showNoty('success', "<i class='fas fa-toggle-on'></i> <b>Option:</b> <u>Disable Tray</u> is now enabled.")
        utils.writeConsoleMsg('info', 'settingToggleDisableTray ::: Finished enabling DisableTray')
    } else {
        ipcRenderer.send('recreateTray')
        writeLocalUserSetting('settingDisableTray', false)
        utils.showNoty('success', "<i class='fas fa-toggle-off'></i> <b>Option:</b> <u>Disable Tray</u> is now disabled.")
        utils.writeConsoleMsg('info', 'settingToggleDisableTray ::: Finished re-enabling DisableTray')
    }
}

/**
* @function settingToggleUrgentWindow
* @summary Enables or disabled the urgent window mode
* @description Updates the settings / option Urgentwindow
* @memberof renderer
*/
function settingToggleUrgentWindow () {
    // Handle depending on the checkbox state
    if ($('#checkboxSettingUrgentWindow').prop('checked')) {
        writeLocalUserSetting('settingUrgentWindow', true)
        utils.showNoty('success', "<i class='fas fa-toggle-on'></i> <b>Option:</b> <u>Urgent window</u> is now enabled.")
        utils.writeConsoleMsg('info', 'settingToggleUrgentWindow ::: Finished enabling UrgentWindow')
    } else {
        writeLocalUserSetting('settingUrgentWindow', false)
        utils.showNoty('success', "<i class='fas fa-toggle-off'></i> <b>Option:</b> <u>Urgent window</u> is now disabled.")
        utils.writeConsoleMsg('info', 'settingToggleUrgentWindow ::: Finished re-enabling UrgentWindow')
    }
}

/**
* @function settingsSelectServiceToAddChanged
* @summary Changes the add-service-template was selected and enables the button
* @description Changes the add-service-template was selected and enables the button
* @memberof renderer
*/
function settingsSelectServiceToAddChanged () {
    var currentSelectedServiceTemplate = $('#select_availableServices').val()
    utils.writeConsoleMsg('info', 'settingsSelectServiceToAddChanged ::: Value of service-template select has changed to: _' + currentSelectedServiceTemplate + '_.')

    if (currentSelectedServiceTemplate !== '') {
        $('#bt_addNewService').prop('disabled', false) // enable the add button

        // change button type to success
        $('#bt_addNewService').removeClass()
        $('#bt_addNewService').addClass('btn btn-success btn-sm')

        utils.writeConsoleMsg('info', 'settingsSelectServiceToAddChanged ::: Enabled the add-service button.')
    }
}

/**
* @function showNotyAutostartMinimizedConfirm
* @summary Shows a dialog while configuring the autostart.
* @description Asks the user if the autostart should be minimized or not
* @memberof renderer
*/
function showNotyAutostartMinimizedConfirm () {
    var AutoLaunch = require('auto-launch')
    const Noty = require('noty')
    var n = new Noty(
        {
            theme: 'bootstrap-v4',
            layout: 'bottom',
            type: 'information',
            closeWith: [''], // to prevent closing the confirm-dialog by clicking something other then a confirm-dialog-button
            text: 'Should autostart enable the minimize mode?',
            buttons: [
                Noty.button('Yes', 'btn btn-success', function () {
                    // enable start minimized
                    var ttthAutoLauncher = new AutoLaunch({
                        name: 'ttth',
                        isHidden: true,
                        useLaunchAgent: true
                    })

                    ttthAutoLauncher.enable()
                    writeLocalUserSetting('settingAutostart', true)
                    n.close()
                    utils.showNoty('success', "<i class='fas fa-toggle-on'></i> <b>Option:</b> <u>Minimized Autostart (on login)</u> is now enabled.")
                },
                {
                    id: 'button1', 'data-status': 'ok'
                }),

                Noty.button('No', 'btn btn-secondary float-right', function () {
                    var ttthAutoLauncher = new AutoLaunch({
                        name: 'ttth',
                        isHidden: false,
                        useLaunchAgent: true
                    })

                    ttthAutoLauncher.enable()
                    writeLocalUserSetting('settingAutostart', true)
                    n.close()
                    utils.showNoty('success', "<i class='fas fa-toggle-on'></i> <b>Option:</b> <u>Autostart (on login)</u> is now enabled.")
                })
            ]
        })

    n.show() // show the noty dialog
}

/**
* @function openUserServicesConfigFolder
* @summary Opens the folder in filesystem which contains the service configurations of the current user
* @description Triggers a method in main.js which then opens the folder which contains all service configurations of the current user.
* @memberof renderer
*/
function openUserServicesConfigFolder () {
    const { ipcRenderer } = require('electron')
    ipcRenderer.send('openUserServicesConfigFolder')
    utils.writeConsoleMsg('info', 'openUserServicesConfigFolder ::: Should try to open the folder which contains the user configured services.')
}

/**
* @function openUserSettingsConfigFolder
* @summary Opens the folder in filesystem which contains the user settings
* @description Triggers a method in main.js which then opens the folder which contains all user settings
* @memberof renderer
*/
function openUserSettingsConfigFolder () {
    const { ipcRenderer } = require('electron')
    ipcRenderer.send('openUserSettingsConfigFolder')
    utils.writeConsoleMsg('info', 'openUserSettingsConfigFolder ::: Should try to open the folder which contains the user settings.')
}

/**
* @function updateTrayIconStatus
* @summary Updates the tray icon
* @description Checks the tabs of all services and fetches the content of the related batch. Based on the overall unread message account it triggers the update of the tray icon
* @memberof renderer
*/
function updateTrayIconStatus () {
    var overallUnreadMessages = 0 // counts unread messages for all enabled services
    var curServiceUnreadMessageCount = 0 // contains the unread-message count for a single service
    var currentTabId

    // loop over all tabs - count unread messages
    $('#myTabs li a').each(function () {
        currentTabId = $(this).attr('id')

        // for all tabs - but NOT for the settings tab
        if (currentTabId !== 'target_Settings') {
            currentTabId = currentTabId.replace('target_', '')

            curServiceUnreadMessageCount = 0 // reset to 0
            curServiceUnreadMessageCount = $('#badge_' + currentTabId).html()
            curServiceUnreadMessageCount = Number(curServiceUnreadMessageCount)

            // if the current service has a significant unread message count -> log it and add it to overall counter
            if ((curServiceUnreadMessageCount !== 0) && (curServiceUnreadMessageCount !== '') && (curServiceUnreadMessageCount !== null)) {
                overallUnreadMessages = overallUnreadMessages + curServiceUnreadMessageCount // increase the overall counter
            }
            utils.writeConsoleMsg('info', 'updateTrayIconStatus ::: Unread messages count of _' + currentTabId + '_ is: ' + curServiceUnreadMessageCount)
        }
    })

    utils.writeConsoleMsg('info', 'updateTrayIconStatus ::: Overall unread message count for all services is: _' + overallUnreadMessages + '_.')

    const { ipcRenderer } = require('electron')
    if ((overallUnreadMessages === '0') || (overallUnreadMessages === 0)) {
        ipcRenderer.send('changeTrayIconToDefault') // tray should show the default icon
    } else {
        // tray should show that we got unread messages
        ipcRenderer.send('changeTrayIconToUnreadMessages')
        readLocalUserSetting('settingUrgentWindow', true)
    }

    // Update the badgeCount of the app. See #152
    ipcRenderer.send('updateBadgeCount', overallUnreadMessages)
}

/**
* @function doAnimateServiceIcon
* @summary Starts or stops the animation of the service tab icon
* @description Adds or removes a class to the service icon in the related service tab. FontAwesome Animating icons: https://fontawesome.com/how-to-use/on-the-web/styling/animating-icons
* @memberof renderer
* @param {boolean} doOrDont - True = enable animation, false = stop the animation.
* @param {string} serviceId - The id of the related service
*/
function doAnimateServiceIcon (doOrDont, serviceId) {
    if (doOrDont === true) {
        $('#icon_' + serviceId).addClass('fa-spin') // start to spin the service icon in the tabmenu
        utils.writeConsoleMsg('info', 'doAnimateServiceIcon ::: Started to animate the icon of the service _' + serviceId + '_.')
    } else {
        $('#icon_' + serviceId).removeClass('fa-spin') // stop to spin the service icon in the tabmenu
        utils.writeConsoleMsg('info', 'doAnimateServiceIcon ::: Stopped animating the icon of the service _' + serviceId + '_.')
    }
}

/**
* @function updateServiceBadge
* @summary Updates the badge in a tab of a single service
* @description gets the name of a service and its current unread message count. Updates the badge of the related service
* @memberof renderer
* @param {string} serviceId - ID of the service
* @param {number} count - Amount of unread messages
*/
function updateServiceBadge (serviceId, count) {
    utils.writeConsoleMsg('info', 'updateServiceBadge ::: New unread count for service _' + serviceId + '_ is: _' + count + '_.')

    // if count is < 1 - badge should show nothing
    if ((count === null) || (count === 0) || (count === 'null') || (count === '0')) {
        count = ''
    }

    $('#badge_' + serviceId).html(count) // update the badge
    updateTrayIconStatus() // Update tray icon status if needed
}

/**
* @function eventListenerForSingleService
* @summary Adds several EventListeners to the webview of the service
* @description Defines several EventListeners to the webview of the service and starts a periodic request to check for unread messages
* @memberof renderer
* @param serviceId - the ID of the service
* @param enableUnreadMessageHandling - boolean - if unread message handler should be created
* @param enableLinkSupport - boolean - if link handler should be created
*/
function eventListenerForSingleService (serviceId, enableUnreadMessageHandling = true, enableLinkSupport = false) {
    utils.writeConsoleMsg('info', 'eventListenerForSingleService ::: Adding event listeners for webview: _webview_' + serviceId + '_.')

    var webview = document.getElementById('webview_' + serviceId) // get webview ( https://electronjs.org/docs/api/webview-tag )

    // run it periodically
    //
    //  5.000 =  5 sec
    var intervalID = setInterval(function () {
        webview.send('request')
    }, 3000) // 3.000 milliseconds = 3 sec

    // TODO:
    // add a network-connectivity check for each single service?

    // -----------------------------------------
    // adding general webview events (valid for all services)
    // -----------------------------------------

    // WebView Event: load-commit (https://electronjs.org/docs/api/webview-tag#event-load-commit)
    // Fired when a load has committed. This includes navigation within the current document as well as subframe document-level loads, but does not include asynchronous resource loads.
    /*
    webview.addEventListener('load-commit', function () {
        utils.writeConsoleMsg('info', 'eventListenerForSingleService ::: load-commit for: _' + serviceId + '_.')

        // start to spin the service icon in the tabmenu
        // doAnimateServiceIcon(true, serviceId);
    })
    */

    // WebView Event: did-fail-load (https://electronjs.org/docs/api/webview-tag#event-did-fail-load)
    // This event is like did-finish-load, but fired when the load failed or was cancelled, e.g. window.stop() is invoked.
    webview.addEventListener('did-fail-load', function () {
        utils.writeConsoleMsg('error', 'eventListenerForSingleService ::: did-fail-load for: _' + serviceId + '_.')

        // stop to spin the service icon in the tabmenu
        doAnimateServiceIcon(false, serviceId)

        /*
        var checkForGoogleMessages = serviceId.startsWith('googleMessages')
        var checkForMicrosoftOutlook = serviceId.startsWith('microsoftOutlook')
        var checkForMicrosoftTeams = serviceId.startsWith('microsoftTeams')
        if ((checkForGoogleMessages === false) && (checkForMicrosoftOutlook === false) && (checkForMicrosoftTeams === false)) {
            // show noty for all services except microsoftOutlook & microsoftTeams (as it throws tons of errors)
            utils.showNoty('error', 'Failed to load url for service: <b>' + serviceId + '</b>.', 0) // #119
        }
        */
    })

    // WebView Event: crashed (https://electronjs.org/docs/api/webview-tag#event-crashed)
    // Fired when the renderer process is crashed.
    webview.addEventListener('crashed', function (e) {
        // stop to spin the service icon in the tabmenu
        doAnimateServiceIcon(false, serviceId)

        utils.writeConsoleMsg('error', 'eventListenerForSingleService ::: crashed for: _' + serviceId + '_.')
        utils.writeConsoleMsg('error', e)
        utils.showNoty('error', 'Ooops, the service <b>' + serviceId + '</b> crashed.', 0)
    })

    // WebView Event: page-title-updated (https://electronjs.org/docs/api/webview-tag#event-page-title-updated)
    // Fired when page title is set during navigation. explicitSet is false when title is synthesized from file url.
    /*
    webview.addEventListener('page-title-updated', function () {
        utils.writeConsoleMsg('info', 'eventListenerForSingleService ::: page-title-updated for: _' + serviceId + '_.')
    })
    */

    // WebView Event: plugin-crashed (https://electronjs.org/docs/api/webview-tag#event-plugin-crashed)
    // Fired when a plugin process is crashed.
    /*
    webview.addEventListener('plugin-crashed', function () {
        utils.writeConsoleMsg('error', 'eventListenerForSingleService ::: plugin-crashed for: _' + serviceId + '_.')
    })
    */

    // WebView Event: destroyed (https://electronjs.org/docs/api/webview-tag#event-destroyed)
    // Fired when the WebContents is destroyed.
    /*
    webview.addEventListener('destroyed', function () {
        utils.writeConsoleMsg('error', 'eventListenerForSingleService ::: destroyed for: _' + serviceId + '_.')
    })
    */

    // WebView Event: update-target-url (https://electronjs.org/docs/api/webview-tag#event-update-target-url)
    // Emitted when mouse moves over a link or the keyboard moves the focus to a link.
    /*
    webview.addEventListener('update-target-url', function () {
        utils.writeConsoleMsg('info', 'eventListenerForSingleService ::: update-target-url for: _' + serviceId + '_.')
    })
    */

    // WebView Event: devtools-opened (htps://electronjs.org/docs/api/webview-tag#event-devtools-opened)
    // Emitted when DevTools is opened.
    /*
    webview.addEventListener('devtools-opened', function () {
        utils.writeConsoleMsg('info', 'eventListenerForSingleService ::: devtools-opened for: _' + serviceId + '_.')
    })
    */

    // WebView Event: devtools closed (https://electronjs.org/docs/api/webview-tag#event-devtools-closed)
    // Emitted when DevTools is closed.
    /*
    webview.addEventListener('devtools-closed', function () {
        utils.writeConsoleMsg('info', 'eventListenerForSingleService ::: devtools closed for: _' + serviceId + '_.')
    })
    */

    // WebView Event: close (https://electronjs.org/docs/api/webview-tag#event-close)
    // Fired when the guest page attempts to close itself.
    /*
    webview.addEventListener('close', function () {
        utils.writeConsoleMsg('info', 'eventListenerForSingleService ::: close for: _' + serviceId + '_.')
    })
    */

    // WebView Event: console-message (https://electronjs.org/docs/api/webview-tag#event-console-message)
    //
    // webview.addEventListener("console-message", function()
    // {
    // utils.writeConsoleMsg("info", "eventListenerForSingleService ::: console-message");
    // });

    // WebView Event: did-start-loading
    // Corresponds to the points in time when the spinner of the tab starts spinning.
    webview.addEventListener('did-start-loading', function () {
        utils.writeConsoleMsg('info', 'eventListenerForSingleService ::: did-start-loading for: _' + serviceId + '_.')
        doAnimateServiceIcon(true, serviceId) // start to spin the service icon in the tabmenu
        webview.send('request') // Triggering search for unread messages
    })

    // WebView Event: did-finish-load
    // Fired when the navigation is done, i.e. the spinner of the tab will stop spinning, and the onload event is dispatched.
    webview.addEventListener('did-finish-load', function () {
        utils.writeConsoleMsg('info', 'eventListenerForSingleService ::: did-finish-load for: _' + serviceId + '_.')
        doAnimateServiceIcon(false, serviceId) // stop to spin the service icon in the tabmenu
    })

    // WebView Event: did-frame-finish-load
    // Fired when a frame has done navigation.
    webview.addEventListener('did-frame-finish-load', function () {
        utils.writeConsoleMsg('info', 'eventListenerForSingleService ::: did-frame-finish-load for: _' + serviceId + '_.')
        doAnimateServiceIcon(false, serviceId) // stop to spin the service icon in the tabmenu
    })

    // WebView Event: did-stop-loading
    // Corresponds to the points in time when the spinner of the tab stops spinning.
    webview.addEventListener('did-stop-loading', function () {
        utils.writeConsoleMsg('info', 'eventListenerForSingleService ::: did-stop-loading for: _' + serviceId + '_.')
        doAnimateServiceIcon(false, serviceId) // stop to spin the service icon in the tabmenu
    })

    // WebView Event: dom-ready
    // Fired when document in the given frame is loaded.
    webview.addEventListener('dom-ready', function () {
        utils.writeConsoleMsg('info', 'eventListenerForSingleService ::: DOM-Ready for: _' + serviceId + '_.')
        doAnimateServiceIcon(false, serviceId) // stop to spin the service icon in the tabmenu
    })

    // -----------------------------------------
    // Specific WebView Events for UnreadMessageHandling
    // -----------------------------------------
    if (enableUnreadMessageHandling === true) {
        // WebView Event:  ipc-message
        //
        webview.addEventListener('ipc-message', (event) => {
            utils.writeConsoleMsg('info', 'eventListenerForSingleService ::: ipc-message for: _' + serviceId + '_.')

            // update the badge
            if (event.channel !== null) {
                updateServiceBadge(serviceId, event.channel)
            }
        })
    }
    // /WebView Events for UnreadMessageHandling

    // -----------------------------------------
    // Specific WebView Event: new-window / clicking links
    // -----------------------------------------
    if (enableLinkSupport === true) {
        webview.addEventListener('new-window', function (event) {
            utils.writeConsoleMsg('info', 'eventListenerForSingleService ::: new-window for: _' + serviceId + '_.')

            const shell = require('electron').shell
            const protocol = require('url').parse(event.url).protocol
            if (protocol === 'http:' || protocol === 'https:') {
                // Display warning for http links - see: https://electronjs.org/docs/tutorial/security
                if (protocol === 'http:') {
                    const Noty = require('noty')
                    var n = new Noty(
                        {
                            theme: 'bootstrap-v4',
                            layout: 'bottom',
                            type: 'information',
                            closeWith: [''], // to prevent closing the confirm-dialog by clicking something other then a confirm-dialog-button
                            text: 'Do you really want to open this unsecure link (not using https://) ?',
                            buttons: [
                                Noty.button('Yes', 'btn btn-danger', function () {
                                    n.close()
                                    utils.writeConsoleMsg('info', 'User confirmed to open non-https:// link: _' + event.url + '_.')
                                    shell.openExternal(event.url)
                                },
                                {
                                    id: 'button1', 'data-status': 'ok'
                                }),

                                Noty.button('No', 'btn btn-success float-right', function () {
                                    n.close()
                                })
                            ]
                        })

                    // show the noty dialog
                    n.show()
                } else {
                    // its https://
                    shell.openExternal(event.url)
                }
            }
        })
    }
    // /WebView Event: new-window / clicking links

    utils.writeConsoleMsg('info', 'eventListenerForSingleService ::: End for service: _' + serviceId + '_.')
}

/**
* @function closeSingleServiceConfiguratationWindow
* @summary Triggers a function in main.js to close the single-service-configuration popup window
* @description Triggers a function in main.js to close the single-service-configuration popup window
* @memberof renderer
*/
function closeSingleServiceConfiguratationWindow () {
    const { ipcRenderer } = require('electron')
    ipcRenderer.send('closeConfigureSingleServiceWindow')
}

/**
* @function validateConfigSingleServiceForm
* @summary Validate the required input values from the config-single-service form
* @description Validate the required input values from the config-single-service form
* @memberof renderer
* @param {string} serviceName - The display name of the service
* @param {string} serviceIcon - The icon for this service
* @param {string} serviceUrl - The url of this service
* @return {boolean} true or false - depending on the actual form validation
*/
function validateConfigSingleServiceForm (serviceName, serviceIcon, serviceUrl) {
    utils.writeConsoleMsg('info', 'validateConfigSingleServiceForm ::: Starting to validate the form.')
    if ((serviceName === '') || (serviceIcon === '') || (serviceUrl === '')) {
        utils.writeConsoleMsg('warn', 'validateConfigSingleServiceForm ::: Form is not valid.')
        return false
    } else {
        utils.writeConsoleMsg('info', 'validateConfigSingleServiceForm ::: Form is valid.')
        return true
    }
}

/**
* @function createSingleServiceConfiguration
* @summary Fetches the input values from the single-service-configuration popup window and creates a related service config
* @description Fetches the input values from the single-service-configuration popup window and creates a related service config
* @memberof renderer
*/
function createSingleServiceConfiguration () {
    const storage = require('electron-json-storage')
    utils.writeConsoleMsg('info', 'createSingleServiceConfiguration ::: Starting to create a new service config')

    // get values from configServiceWindow
    var serviceId = $('#input_serviceId').val()
    var serviceType = $('#input_serviceType').val() // hidden
    var serviceName = $('#input_serviceName').val()
    var serviceIcon = $('#input_serviceIcon').val()
    var serviceUrl = $('#input_serviceUrl').val()
    var serviceInjectCode = $('#input_serviceInjectCode').val() // hidden
    var serviceUserAgentDefault = $('#input_serviceUserAgentDefault').val()
    var serviceUserAgentCustom = $('#input_serviceUserAgentCustom').val()
    var serviceEnableStatus = true

    var isFormValid = validateConfigSingleServiceForm(serviceName, serviceIcon, serviceUrl)
    if (isFormValid === true) {
        // create a new config for the configured service
        storage.set(serviceId, {
            type: serviceType,
            name: serviceName,
            icon: serviceIcon,
            url: serviceUrl,
            injectCode: serviceInjectCode,
            serviceEnableStatus: serviceEnableStatus,
            userAgentDefault: serviceUserAgentDefault,
            userAgentCustom: serviceUserAgentCustom
        },
        function (error) {
            const { ipcRenderer } = require('electron')
            ipcRenderer.send('reloadMainWindow') // reload the main window
            closeSingleServiceConfiguratationWindow() // close aka hide the configWindow
            utils.writeConsoleMsg('info', 'createSingleServiceConfiguration ::: Created a new service config for: _' + serviceId + '_.')

            if (error) {
                utils.writeConsoleMsg('error', 'createSingleServiceConfiguration ::: Error: ' + error)
                throw error
            }
        })
    }
}

/**
* @function updateSingleServiceConfiguration
* @summary Fetches the input values from the single-service-configuration popup window and updates the related service config
* @description Fetches the input values from the single-service-configuration popup window and updates the related service config
* @memberof renderer
*/
function updateSingleServiceConfiguration () {
    utils.writeConsoleMsg('info', 'updateSingleServiceConfiguration ::: Starting to update an existing service config')

    const storage = require('electron-json-storage')

    // get values from configServiceWindow
    var serviceId = $('#input_serviceId').val()
    var serviceType = $('#input_serviceType').val() // hidden
    var serviceName = $('#input_serviceName').val()
    var serviceIcon = $('#input_serviceIcon').val()
    var serviceUrl = $('#input_serviceUrl').val()
    var serviceUserAgentDefault = $('#input_serviceUserAgentDefault').val()
    var serviceUserAgentCustom = $('#input_serviceUserAgentCustom').val()
    var serviceInjectCode = $('#input_serviceInjectCode').val() // hidden
    var serviceEnableStatus = $('#input_serviceEnableStatus').val() // hidden

    if (serviceEnableStatus === 'true') {
        serviceEnableStatus = true
    } else {
        serviceEnableStatus = false
    }

    var isFormValid = validateConfigSingleServiceForm(serviceName, serviceIcon, serviceUrl)
    if (isFormValid === true) {
        // update the config of the configured service (status)
        storage.set(serviceId, {
            type: serviceType,
            name: serviceName,
            icon: serviceIcon,
            url: serviceUrl,
            injectCode: serviceInjectCode,
            serviceEnableStatus: serviceEnableStatus,
            userAgentDefault: serviceUserAgentDefault,
            userAgentCustom: serviceUserAgentCustom
        }, function (error) {
            const { ipcRenderer } = require('electron')
            ipcRenderer.send('reloadMainWindow') // reload the main window
            closeSingleServiceConfiguratationWindow() // close aka hide the configWindow
            utils.writeConsoleMsg('info', 'updateSingleServiceConfiguration ::: Updating service config: _' + serviceId + '_.')

            if (error) {
                utils.writeConsoleMsg('error', 'updateSingleServiceConfiguration ::: Error: ' + error)
                throw error
            }
        })
    }
}

/**
* @function configureSingleUserService
* @summary Triggers a function in main.js to  open the single-service-configuration popup window
* @description Triggers a function in main.js to  open the single-service-configuration popup window
* @memberof renderer
* @param {string} serviceId - id of the service
*/
function configureSingleUserService (serviceId) {
    const { ipcRenderer } = require('electron')
    utils.writeConsoleMsg('info', 'configureSingleUserService ::: Trying to open service configure window for service: _' + serviceId + '_.')
    ipcRenderer.send('showConfigureSingleServiceWindow', serviceId) // send ipc to show service-configuration window



}

/**
* @function openDevTools
* @summary Toggles the DevConsole
* @description Opens or closes the Developer Console inside the app. Gets called from mainWindow.html
* @memberof renderer
*/
function openDevTools () {
    const remote = require('electron').remote
    utils.writeConsoleMsg('info', 'openDevTools ::: Opening Developer Console')
    remote.getCurrentWindow().toggleDevTools()
}

/**
* @function settingToggleAutostart
* @summary Enables or disables the autostart
* @description Enables or disables the autostart
* @memberof renderer
*/
function settingToggleAutostart () {
    const isDev = require('electron-is-dev')
    if (isDev) {
        utils.showNoty('warning', 'Configuring autostart is only supported in packaged builds.')
        $('#checkboxSettingAutostart').prop('checked', false) // unselect the autostart checkbox
    } else {
        var AutoLaunch = require('auto-launch') // auto-launch - via: https://www.npmjs.com/package/auto-launch

        var ttthAutoLauncher = new AutoLaunch({
            name: 'ttth',
            useLaunchAgent: true
        })

        // Handle depending on the checkbox state
        // enabling the autostart
        if ($('#checkboxSettingAutostart').prop('checked')) {
            showNotyAutostartMinimizedConfirm()
        } else {
            ttthAutoLauncher.disable() // disabling the autostart
            writeLocalUserSetting('settingAutostart', false)
            utils.writeConsoleMsg('info', 'settingToggleAutostart ::: Finished disabling Autostart')
            utils.showNoty('success', "<i class='fas fa-toggle-off'></i> <b>Option:</b> <u>Autostart (on login)</u> is now disabled.")
        }

        ttthAutoLauncher.isEnabled()
            .then(function (isEnabled) {
                if (isEnabled) {
                    return
                }
                ttthAutoLauncher.enable()
            })
            .catch(function (err) {
                utils.writeConsoleMsg('error', 'settingToggleAutostart ::: Error: ' + err)
                throw err
            })
    }
}

/**
* @function settingDefaultViewUpdate
* @summary Stores a new default view to local storage
* @description Users can define a default / startup view in settings. This method stores the users choice into local storage.
* @memberof renderer
*/
function settingDefaultViewUpdate () {
    var newDefaultView = $('#selectDefaultView').val() // get currently selected value from select

    if (newDefaultView !== null) {
        utils.writeConsoleMsg('info', 'settingDefaultViewUpdate ::: New default view on start is set to: ' + newDefaultView)
        writeLocalUserSetting('settingDefaultView', newDefaultView) // Store new default view in local storage
        utils.showNoty('success', 'Set default view to <b>' + newDefaultView + '</b>.') // show noty
    } else {
        utils.showNoty('warning', 'Please <b>choose a service</b> to set a custom <b>default view</b>.') // user forgot to select a service for new default view
    }
}

/**
* @function checkSupportedOperatingSystem
* @summary Checks if the operating system is supported or not
* @description Checks if the operating system is linux, windows or macOS. Those are supported - others are currently not.
* @memberof renderer
*/
function checkSupportedOperatingSystem () {
    var supportedOperatingSystemMessage = ''
    var userPlatform = process.platform // process.platform (works without require) vs os.platform
    utils.writeConsoleMsg('info', 'checkSupportedOperatingSystem ::: Detected operating system as: ' + userPlatform)

    switch (userPlatform) {
    case 'win32':
    case 'windows':
    case 'linux':
    case 'darwin':
    case 'freebsd':
        utils.writeConsoleMsg('info', 'checkSupportedOperatingSystem ::: Operating system ' + userPlatform + ' is fine.')
        break

    default:
        // could be: sunos or whatever else
        supportedOperatingSystemMessage = userPlatform + ' is currently not supported. Please contact devs.' // define message
        utils.showNoty('warning', supportedOperatingSystemMessage, 0)
        utils.writeConsoleMsg('error', 'checkSupportedOperatingSystem ::: ' + supportedOperatingSystemMessage)
    }
}

/**
* @function openReleasesOverview
* @summary Opens the ttth release page
* @description Opens the url https://github.com/yafp/ttth/releases in the default browser. Used in searchUpdate().
* @memberof renderer
*/
function openReleasesOverview () {
    const { urlGitHubReleases } = require('./js/ttth/modules/urlsGithub.js')
    utils.writeConsoleMsg('info', 'openReleasesOverview ::: Opening _' + urlGitHubReleases + '_ to show available releases')
    utils.openURL(urlGitHubReleases)
}

/**
* @function searchUpdate
* @summary Checks if there is a new release available
* @description Compares the local app version number with the tag of the latest github release. Displays a notification in the settings window if an update is available.
* @param {boolean} [silent] - Boolean with default value. Shows a feedback in case of no available updates If "silent" = false. Special handling for manually triggered update search
* @memberof renderer
*/
function searchUpdate (silent = true) {
    const { urlGitHubRepoTags } = require('./js/ttth/modules/urlsGithub.js')

    // when executed manually via menu -> user should see that update-check is running
    if (silent === false) {
        utils.showNoty('info', 'Searching for updates')
    }

    var remoteAppVersionLatest = '0.0.0'
    var localAppVersion = '0.0.0'
    var versions

    utils.writeConsoleMsg('info', 'searchUpdate ::: Start checking _' + urlGitHubRepoTags + '_ for available releases')

    var updateStatus = $.get(urlGitHubRepoTags, function (data) {
        3000 // in milliseconds

        // success
        versions = data.sort(function (v1, v2) {
            // return semver.compare(v2.name, v1.name);
        })

        // get remote version
        //
        remoteAppVersionLatest = versions[0].name
        // remoteAppVersionLatest = '66.6.6' // overwrite variable to simulate available updates

        // get local version
        //
        localAppVersion = require('electron').remote.app.getVersion()
        // localAppVersion = "1.0.0"; // to simulate

        utils.writeConsoleMsg('info', 'searchUpdate ::: Local version: ' + localAppVersion)
        utils.writeConsoleMsg('info', 'searchUpdate ::: Latest public version: ' + remoteAppVersionLatest)

        // Update available
        if (localAppVersion < remoteAppVersionLatest) {
            utils.writeConsoleMsg('warn', 'searchUpdate ::: Found update, notify user')

            // using a confirm dialog - since #150
            const Noty = require('noty')
            var n = new Noty(
                {
                    theme: 'bootstrap-v4',
                    layout: 'bottom',
                    type: 'information',
                    closeWith: [''], // to prevent closing the confirm-dialog by clicking something other then a confirm-dialog-button
                    text: 'A <b>ttth</b> update from <b>' + localAppVersion + '</b> to version <b>' + remoteAppVersionLatest + '</b> is available. Do you want to visit the <b>ttth release page</b>?',
                    buttons: [
                        Noty.button('Yes', 'btn btn-success', function () {
                            n.close()
                            openReleasesOverview()
                        },
                        {
                            id: 'button1', 'data-status': 'ok'
                        }),

                        Noty.button('No', 'btn btn-danger float-right', function () {
                            n.close()
                        })
                    ]
                })

            // show the noty dialog
            n.show()
        } else {
            // No update available
            utils.writeConsoleMsg('info', 'searchUpdate ::: No newer version found.')

            // when executed manually via menu -> user should see result of this search
            if (silent === false) {
                utils.showNoty('success', 'No updates available')
            }
        }

        utils.writeConsoleMsg('info', 'searchUpdate ::: Successfully checked ' + urlGitHubRepoTags + ' for available releases')
    })
        .done(function () {
        // utils.writeConsoleMsg("info", "searchUpdate ::: Successfully checked " + url + " for available releases");
        })

        .fail(function () {
            utils.writeConsoleMsg('error', 'searchUpdate ::: Checking ' + urlGitHubRepoTags + ' for available releases failed.')
            utils.showNoty('error', 'Checking <b>' + urlGitHubRepoTags + '</b> for available releases failed. Please troubleshoot your network connection.')
        })

        .always(function () {
            utils.writeConsoleMsg('info', 'searchUpdate ::: Finished checking ' + urlGitHubRepoTags + ' for available releases')
        })
}

/**
* @function validateConfiguredDefaultView
* @summary Checks on startup if the service configured as default view is a valid / enabled service
* @description Checks if the default view is valid, otherwise fallbacks to settings view
* @memberof renderer
*/
function validateConfiguredDefaultView () {
    readLocalUserSetting('settingDefaultView')
}

/**
* @function loadServiceSpecificCode
* @summary Executes service specific javascript code on service-activation
* @description Executes service specific javascript code on service-activation
* @memberof renderer
* @param {string} serviceId - The ID of the service
* @param {string} serviceName - Name of the service
*/
function loadServiceSpecificCode (serviceId, serviceName) {
    utils.writeConsoleMsg('info', 'loadServiceSpecificCode ::: Checking for service-specific code for the service: ' + serviceName + ' with the id: _' + serviceId + '_.')

    switch (serviceName) {
    // V1: unread message handler: NO - &&  Link handler: NO
    //
    case 'discord':
    case 'dropbox':
    case 'github':
    case 'googleCalendar':
    case 'googleContacts':
    case 'googleDrive':
    case 'googlePhotos':
    case 'nextcloud':
        utils.writeConsoleMsg('info', 'loadServiceSpecificCode ::: Executing ' + serviceName + ' specific things')
        eventListenerForSingleService(serviceId, false, false)
        break

        // V2: unread-message-handler: NO - && - Link-handler: YES
    case 'freenode':
    case 'googleDuo':
    case 'googleKeep':
    case 'linkedIn':
    case 'reddit':
    case 'wechat':
    case 'wire':
        utils.writeConsoleMsg('info', 'loadServiceSpecificCode ::: Executing ' + serviceName + ' specific things')
        eventListenerForSingleService(serviceId, false, true)
        break

        // V3: Unread-message-handler: YES - && - link handler: NO
    case 'gitter':
    case 'twitter':
    case 'xing':
        utils.writeConsoleMsg('info', 'loadServiceSpecificCode ::: Executing ' + serviceName + ' specific things')
        eventListenerForSingleService(serviceId, true, false)
        break

        // V4: Unread-message-handler: YES && link-handler: YES
    case 'googleMail':
    case 'googleMessages':
    case 'icq':
    case 'mattermost':
    case 'messenger':
    case 'microsoftOutlook':
    case 'microsoftOffice365':
    case 'microsoftTeams':
    case 'riot':
    case 'slack':
    case 'skype':
    case 'steam':
    case 'telegram':
    case 'threema':
        utils.writeConsoleMsg('info', 'loadServiceSpecificCode ::: Executing ' + serviceName + ' specific things')
        eventListenerForSingleService(serviceId, true, true)
        break

        // Specialcase: WhatsApp
    case 'whatsapp':
        utils.writeConsoleMsg('info', 'loadServiceSpecificCode ::: Executing ' + serviceName + ' specific things')
        /* global serviceWhatsAppRegister */
        serviceWhatsAppRegister()
        eventListenerForSingleService(serviceId, true, true)
        break

    default:
            // utils.writeConsoleMsg("info", "loadServiceSpecificCode ::: Nothing to do here");
    }
}

/**
* @function initAvailableServicesSelection
* @summary fills the select item in settings-page (which features all supported services)
* @description fills the select item in settings-page (which features all supported services). Source is services.json
* @memberof renderer
*/
function initAvailableServicesSelection () {
    utils.writeConsoleMsg('info', 'initAvailableServicesSelection ::: Reload settings select with all supported service definitions')

    var counterSupportedServices = 0
    const dropdown = $('#select_availableServices') // get reference to select which contains all supported service type definitions
    dropdown.prop('selectedIndex', 0) // select the first entry

    // url to service definitions
    const path = require('path')
    const url = path.join(__dirname, '/js/ttth/services.json')

    // Populate select with list of provinces
    $.getJSON(url, function (data) {
        $.each(data, function (key, entry) {
            dropdown.append($('<option></option>').attr('value', entry.id).text(entry.nameLong)) // add option to select
            counterSupportedServices = counterSupportedServices + 1 // count services
        })

        utils.writeConsoleMsg('info', 'initAvailableServicesSelection ::: Finished reloading settings select with all supported service definitions. Found _' + counterSupportedServices + '_ service types.')
    })
}

/**
* @function loadConfiguredUserServices
* @summary loads all the configured-user-services to the configured-services-section of the settings tab.
* @description removes all configured user services from settings view, reads all configured user services and re-adds them to the settings ui under 'Configured services'
* @memberof renderer
*/
function loadConfiguredUserServices () {
    const storage = require('electron-json-storage')
    const remote = require('electron').remote
    const app = remote.app
    const path = require('path')

    $('#settingsServicesConfigured').empty() // empty the div

    // ensure we are reading from the correct location
    const defaultUserDataPath = app.getPath('userData')
    var customUserDataPath = path.join(defaultUserDataPath, 'storage')
    storage.setDataPath(customUserDataPath)

    // read all user service configuration files
    storage.getAll(function (error, data) {
        if (error) {
            utils.writeConsoleMsg('error', 'loadConfiguredUserServices ::: Error while trying to get all user  service configurations. Error: ' + error)
            throw error
        }

        // show object which contains all config files
        // utils.writeConsoleMsg("error", (data);
        // utils.writeConsoleMsg("error", (typeof data);

        var serviceCount = 0

        utils.writeConsoleMsg('info', 'loadConfiguredUserServices ::: Found the following user configs: _' + data + '_.')

        // loop over upper object
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                utils.writeConsoleMsg('info', 'loadConfiguredUserServices ::: ' + key + ' -> ' + data[key])

                // show 2 services per row
                if (serviceCount % 2 === 0) {
                    // odd
                    // create a new row
                    $('#settingsServicesConfigured').append("<div class='row ttthServiceRow' id='conf_" + serviceCount + "'></div>")

                    if (data[key].serviceEnableStatus === true) {
                        // show enabled configured service
                        $('#conf_' + serviceCount).append('<div class="col-sm-6"><div class="input-group input-group-sm mb-1"><div class="input-group-prepend"><div class="input-group-text"><i title="Service: ' + data[key].type + '" class="ttthServiceIcon ' + data[key].icon + '"></i></div></div><input type="text" class="form-control" id="label_' + data[key].url + '" aria-label="Text input with checkbox" value=' + data[key].name + ' title=' + data[key].url + ' disabled><div class="input-group-prepend"><button type="button" id="bt_configSingleService_' + key + '" title="configure" class="btn btn-dark" onClick="configureSingleUserService(\'' + key + '\')"><i class="fas fa-cog"></i></button><button type="button" class="btn btn-success btn-sm" id="bt_' + key + '" title="enabled" onClick="settingsToggleEnableStatusOfSingleUserService(\'' + key + '\');"><i id=statusIconService_' + key + ' class="fas fa-toggle-on"></i></button><button type="button" class="btn btn-danger btn-sm" id="bt_delete' + key + '" title="delete" onClick="deleteConfiguredService(\'' + key + '\');"><i class="fas fa-trash-alt"></i></button></div></div></div>')
                    } else {
                        // show disabled configured service
                        $('#conf_' + serviceCount).append('<div class="col-sm-6"><div class="input-group input-group-sm mb-1"><div class="input-group-prepend"><div class="input-group-text"><i title="Service: ' + data[key].type + '" class="ttthServiceIcon ' + data[key].icon + '"></i></div></div><input type="text" class="form-control" id="label_' + data[key].url + '" aria-label="Text input with checkbox" value=' + data[key].name + ' title=' + data[key].url + ' disabled><div class="input-group-prepend"><button type="button" id="bt_configSingleService_' + key + '" title="configure" class="btn btn-dark" onClick="configureSingleUserService(\'' + key + '\')"><i class="fas fa-cog"></i></button><button type="button" class="btn btn-secondary btn-sm" id="bt_' + key + '" title="disabled" onClick="settingsToggleEnableStatusOfSingleUserService(\'' + key + '\');"><i id=statusIconService_' + key + ' class="fas fa-toggle-off"></i></button><button type="button" class="btn btn-danger btn-sm" id="bt_delete' + key + '" title="delete" onClick="deleteConfiguredService(\'' + key + '\');"><i class="fas fa-trash-alt"></i></button></div></div></div>')
                    }
                } else {
                    // ...even - add to existing row - in col 2
                    // add something to the existing row
                    var rowReference = serviceCount - 1

                    if (data[key].serviceEnableStatus === true) {
                        // show enabled configured service
                        $('#conf_' + rowReference).append('<div class="col-sm-6"><div class="input-group input-group-sm mb-1"><div class="input-group-prepend"><div class="input-group-text"><i title="Service: ' + data[key].type + '" class="ttthServiceIcon ' + data[key].icon + '"></i></div></div><input type="text" class="form-control" id="label_' + data[key].url + '" aria-label="Text input with checkbox" value=' + data[key].name + ' title=' + data[key].url + ' disabled><div class="input-group-prepend"><button type="button" id="bt_configSingleService_' + key + '" title="configure" class="btn btn-dark" onClick="configureSingleUserService(\'' + key + '\')"><i class="fas fa-cog"></i></button><button type="button" class="btn btn-success btn-sm" id="bt_' + key + '" title="enabled" onClick="settingsToggleEnableStatusOfSingleUserService(\'' + key + '\');"><i id=statusIconService_' + key + ' class="fas fa-toggle-on"></i></button><button type="button" class="btn btn-danger btn-sm" id="bt_delete' + key + '" title="delete" onClick="deleteConfiguredService(\'' + key + '\');"><i class="fas fa-trash-alt"></i></button></div></div></div>')
                    } else {
                        // show disabled configured service
                        $('#conf_' + rowReference).append('<div class="col-sm-6"><div class="input-group input-group-sm mb-1"><div class="input-group-prepend"><div class="input-group-text"><i title="Service: ' + data[key].type + '" class="ttthServiceIcon ' + data[key].icon + '"></i></div></div><input type="text" class="form-control" id="label_' + data[key].url + '" aria-label="Text input with checkbox" value=' + data[key].name + ' title=' + data[key].url + ' disabled><div class="input-group-prepend"><button type="button" id="bt_configSingleService_' + key + '" title="configure" class="btn btn-dark" onClick="configureSingleUserService(\'' + key + '\')"><i class="fas fa-cog"></i></button><button type="button" class="btn btn-secondary btn-sm" id="bt_' + key + '" title="disabled" onClick="settingsToggleEnableStatusOfSingleUserService(\'' + key + '\');"><i id=statusIconService_' + key + ' class="fas fa-toggle-off"></i></button><button type="button" class="btn btn-danger btn-sm" id="bt_delete' + key + '" title="delete" onClick="deleteConfiguredService(\'' + key + '\');"><i class="fas fa-trash-alt"></i></button></div></div></div>')
                    }
                }
                serviceCount = serviceCount + 1
            }
        }
    })

    utils.writeConsoleMsg('info', 'loadConfiguredUserServices ::: Finished loading all configured user services to settings page')
}

/**
* @function initSettingsPage
* @summary Initializes the settings page
* @description Shows links to github informations. update informations. Initializes the service-checkboxes on loading the view.
* @memberof renderer
*/
function initSettingsPage () {
    // Start checking each single option
    readLocalUserSetting('settingAutostart') // Option: Autostart
    readLocalUserSetting('settingTheme') // Option: Theme
    readLocalUserSetting('settingDisableTray') // Option: DisableTray (Linux only)
    readLocalUserSetting('settingUrgentWindow') // Option: Urgent Window
    readLocalUserSetting('settingEnableErrorReporting') // Option: Urgent Window

    // load all supported services to drop-down-list (used for adding new services)
    initAvailableServicesSelection()

    // show all user-configured services under "configured services"
    loadConfiguredUserServices()
}

/**
* @function removeServiceTab
* @summary Remove a single service tab from the UI
* @description Removes the li item from tab menu, removes the tab itself
* @memberof renderer
* @param {string} tabId
*/
function removeServiceTab (tabId) {
    utils.writeConsoleMsg('info', 'removeServiceTab ::: Starting to remove the tab: _' + tabId + '_.')

    // remove service nav-item from menu
    $('#menu_' + tabId).remove()
    utils.writeConsoleMsg('info', 'removeServiceTab ::: Removed service nav item from navigation (_' + tabId + '_)')

    //  get webview
    // var webview = document.getElementById("webview_" + tabId);

    // remove webview listeners
    // webview.removeEventListener("ipc-message");

    // remove webview itself
    // webview.remove();
    // utils.writeConsoleMsg("info", "removeServiceTab ::: Removing the webview itself: _" + webview + "_.");

    // remove tabcontent from tab pane
    $('#' + tabId).remove()

    // remove service from select for DefaultView
    $('#selectDefaultView option[value=' + tabId + ']').remove()

    // reload the main window (see #117 - to avoid sending request to non-existing webviews)
    const { ipcRenderer } = require('electron')
    ipcRenderer.send('reloadMainWindow')

    utils.writeConsoleMsg('info', 'removeServiceTab ::: Finished removing the tab: _' + tabId + '_.')
}

/**
* @function addServiceTab
* @summary Add a single tab to UI
* @description Add the li item to tab menu, adds the tab itself
* @memberof renderer
* @param {string} serviceId
* @param {string} serviceType
* @param {string} serviceName
* @param {string} serviceIcon
* @param {string} serviceUrl
* @param {string} serviceInjectCode
* @param {string} serviceUserAgentDefault
* @param {string} serviceUserAgentCustom
*/
function addServiceTab (serviceId, serviceType, serviceName, serviceIcon, serviceUrl, serviceInjectCode, serviceUserAgentDefault, serviceUserAgentCustom) {
    utils.writeConsoleMsg('info', 'addServiceTab ::: Starting to add the tab: _' + serviceId + '_.')

    // tab-position
    var existingTabs = $('#myTabs li').length // get amount of tabs
    var newTabPosition = existingTabs - 1 // calculate new tab position

    // choose the right userAgent
    var userAgent = appWideUserAgentDefault // setting a project wide default
    if (serviceUserAgentDefault !== '') {
        userAgent = serviceUserAgentDefault // overwrite with service-specific default, if set
    }
    if (serviceUserAgentCustom !== '') {
        userAgent = serviceUserAgentCustom // overwrite with service-specific custom, if set
    }

    // Parsing url and extract domain for persist-handling of webview
    var serviceDomain = utils.getDomain(serviceUrl)

    // add new list item to unordner list (tabs/menu)
    //
    // $('#myTabs li:eq(' + newTabPosition + ')').after('<li class="nav-item small" id=menu_'+ serviceId +'><a class="nav-link ttth_nonSelectableText" id=target_' + serviceId +' href=#' + serviceId + ' role="tab" data-toggle="tab"><i class="' + serviceIcon +'"></i> ' + serviceName + ' <span id=badge_' + serviceId + ' class="badge badge-success"></span></a></li>');
    $('#myTabs li:eq(' + newTabPosition + ')').after("<li class='nav-item small' id=menu_" + serviceId + "><a class='nav-link ttth_nonSelectableText' id=target_" + serviceId + ' href=#' + serviceId + " role='tab' data-toggle='tab'><span id=shortcut_" + serviceId + " class='badge badge-pill badge-warning'></span> <i id=icon_" + serviceId + " class='" + serviceIcon + "'></i> " + serviceName + ' <span id=badge_' + serviceId + " class='badge badge-success'></span></a></li>")

    utils.writeConsoleMsg('info', 'addServiceTab :::Added the navigation tab for service: _' + serviceId + '_.')

    // add the tab itself to #tabPanes
    //
    $('#tabPanes').append("<div role='tabpanel' class='tab-pane fade flex-fill ttth_resizer container-fluid' id=" + serviceId + '></div>')
    utils.writeConsoleMsg('info', 'addServiceTab :::Added the tab pane for service: _' + serviceId + '_.')

    // add webview  to new tab
    //
    if (serviceType === 'whatsapp') {
        // Whatsapp needs: - no partition
        $('#' + serviceId).append('<webview id=webview_' + serviceId + " class='ttth_resizer' src=" + serviceUrl + ' preload=' + serviceInjectCode + " userAgent='" + userAgent + "'></webview>")
    } else {
        if (serviceInjectCode === '') {
            // no inject code
            $('#' + serviceId).append('<webview id=webview_' + serviceId + ' partition=persist:' + serviceDomain + " class='ttth_resizer' src=" + serviceUrl + ' userAgent=' + userAgent + '></webview>')
        } else {
            // got injectCode, preload it
            $('#' + serviceId).append('<webview id=webview_' + serviceId + ' partition=persist:' + serviceDomain + " class='ttth_resizer' src=" + serviceUrl + ' preload=' + serviceInjectCode + ' userAgent=' + userAgent + ' ></webview>')
        }
    }

    utils.writeConsoleMsg('info', 'addServiceTab ::: Finished adding the tab: _' + serviceId + '_.')
    $('#selectDefaultView').append(new Option(serviceName, serviceId)) // add service to select for DefaultView
    loadServiceSpecificCode(serviceId, serviceType)
}

/**
* @function updateGlobalServicesShortcuts
* @summary Assigns global shortcuts for all service tabs
* @description Assigns global shortcuts for all service tabs
* @memberof renderer
*/
function updateGlobalServicesShortcuts () {
    const { ipcRenderer } = require('electron')

    var tabCounter = 0
    var currentTabId
    var numberOfEnabledServices // counts the amount of enabled user services

    utils.writeConsoleMsg('info', 'updateGlobalServicesShortcuts ::: Starting to update global service shortcuts')

    // Ensure to remove all possible shortcuts before re-creating them. See #74
    //
    // count enabled services:
    numberOfEnabledServices = $('#myTabs li').length
    numberOfEnabledServices = numberOfEnabledServices - 1 // as the settings tab doesnt count

    // if there are configured services so far - delete all existing shortcuts
    if (numberOfEnabledServices > 0) {
        // ipcRenderer.send("deleteAllGlobalServicesShortcut", numberOfEnabledServices);
        ipcRenderer.send('deleteAllGlobalServicesShortcut', 9)
    }

    // Create new global shortcuts
    $('#myTabs li a').each(function () {
        currentTabId = $(this).attr('id')
        if (currentTabId === 'target_Settings') {
            utils.writeConsoleMsg('info', 'updateGlobalServicesShortcuts ::: Ignoring settings tab.') // Shortcut for settings tab is already hard-coded.
        } else {
            // dynamic shortcuts for all services (well max. 9 - not all)
            tabCounter = tabCounter + 1

            if (tabCounter < 10) {
                // can't assign shortcuts > 9
                ipcRenderer.send('createNewGlobalShortcut', 'CmdOrCtrl+' + tabCounter, currentTabId) // create dynamic globalShortcut
            }
        }
    })

    utils.writeConsoleMsg('info', 'updateGlobalServicesShortcuts ::: Finished updating global shortcuts for services')
}

/**
* @function settingsToggleEnableStatusOfSingleUserService
* @summary Enables or disabled the status of a single user configured service
* @description User can enable or disable his configured services in settings page.
* @memberof renderer
* @param {string} configuredUserServiceConfigName - Name of the config file of the selected service
*/
function settingsToggleEnableStatusOfSingleUserService (configuredUserServiceConfigName) {
    utils.writeConsoleMsg('info', 'settingsToggleEnableStatusOfSingleUserService ::: Toggling the configured service defined in config file: _' + configuredUserServiceConfigName + '_.')

    // const os = require("os");
    const storage = require('electron-json-storage')
    // const dataPath = storage.getDataPath();

    var serviceEnableStatus

    // get content from service configuration file
    storage.get(configuredUserServiceConfigName, function (error, data) {
        if (error) {
            utils.writeConsoleMsg('info', 'settingsToggleEnableStatusOfSingleUserService ::: Error while trying to get service informations from service _' + configuredUserServiceConfigName + '_ . Error: ' + error)
            throw error
        }

        var type = data.type
        var name = data.name
        var icon = data.icon
        var url = data.url
        var injectCode = data.injectCode
        var userAgentDefault = data.userAgentDefault
        var userAgentCustom = data.userAgentCustom

        // get status of enable/disable button:
        if ($('#bt_' + configuredUserServiceConfigName).attr('title') === 'enabled') {
            // is enabled - so disable it

            // Status Button
            $('#bt_' + configuredUserServiceConfigName).removeClass() // update button type by removing class and ...
            $('#bt_' + configuredUserServiceConfigName).addClass('btn btn-secondary btn-sm') // update button type by adding a new class
            $('#bt_' + configuredUserServiceConfigName).prop('title', 'disabled') // update button title

            // update button icon
            $('#statusIconService_' + configuredUserServiceConfigName).removeClass()
            $('#statusIconService_' + configuredUserServiceConfigName).addClass('fas fa-toggle-off')

            // set serviceEnableStatus variable
            serviceEnableStatus = false

            // remove service tab
            removeServiceTab(configuredUserServiceConfigName)

            utils.writeConsoleMsg('info', 'settingsToggleEnableStatusOfSingleUserService ::: Service _' + configuredUserServiceConfigName + '_ is now disabled.')
            utils.showNoty('success', 'Disabled the service <b>' + configuredUserServiceConfigName + '</b>.')
        } else {
            // is disabled - so enable it

            // Status Button
            $('#bt_' + configuredUserServiceConfigName).removeClass() // update button type by removing class and ...
            $('#bt_' + configuredUserServiceConfigName).addClass('btn btn-success btn-sm') // update button type by adding a new class
            $('#bt_' + configuredUserServiceConfigName).prop('title', 'enabled') // update button title

            // update button icon
            $('#statusIconService_' + configuredUserServiceConfigName).removeClass()
            $('#statusIconService_' + configuredUserServiceConfigName).addClass('fas fa-toggle-on')

            // set serviceEnableStatus variable
            serviceEnableStatus = true

            // add tab for this enabled service
            addServiceTab(configuredUserServiceConfigName, type, name, icon, url, injectCode, userAgentDefault, userAgentCustom)

            // add service to selectDefaultView
            $('#selectDefaultView').append(new Option(name, configuredUserServiceConfigName))

            utils.writeConsoleMsg('info', 'settingsToggleEnableStatusOfSingleUserService ::: Service _' + configuredUserServiceConfigName + '_ is now enabled.')
            utils.showNoty('success', 'Enabled the service <b>' + configuredUserServiceConfigName + '</b>.')
        }

        // update the config of the configured service (status)
        storage.set(configuredUserServiceConfigName, {
            type: type,
            name: name,
            icon: icon,
            url: url,
            injectCode: injectCode,
            serviceEnableStatus: serviceEnableStatus
        }, function (error) {
            if (error) {
                utils.writeConsoleMsg('error', 'settingsToggleEnableStatusOfSingleUserService ::: Error while trying to update the user service _' + configuredUserServiceConfigName + '_. Error: ' + error)
                throw error
            }

            // must re-set the globalShortcuts for all existing services / tabs - see #74
            updateGlobalServicesShortcuts()
        })
    })

    utils.writeConsoleMsg('info', 'settingsToggleEnableStatusOfSingleUserService ::: Service _' + configuredUserServiceConfigName + '_ config file is now updated (status)')
}

/**
* @function settingsToggleErrorReporting
* @summary Enables or disabled the error reporting function
* @description Enables or disabled the error reporting function
* @memberof renderer
*/
function settingsToggleErrorReporting () {
    if ($('#checkboxSettingErrorReporting').is(':checked')) {
        utils.writeConsoleMsg('info', 'settingsToggleErrorReporting ::: Error reporting is now enabled')
        writeLocalUserSetting('settingEnableErrorReporting', true)
        sentry.enableSentry()
        utils.showNoty('success', "<i class='fas fa-toggle-on'></i> <b>Option:</b> <u>Error Reporting</u> is now enabled.")
        // myUndefinedFunctionFromRendererAfterEnable()
    } else {
        // ask if user really wants to disable error-reporting
        // using a confirm dialog
        const Noty = require('noty')
        var n = new Noty(
            {
                theme: 'bootstrap-v4',
                layout: 'bottom',
                type: 'info',
                closeWith: [''], // to prevent closing the confirm-dialog by clicking something other then a confirm-dialog-button
                text: 'Do you really want to disable error-reporting?<br><br>* We don\'t track users<br>* We do collect error reports<br><br>This helps us finding and fixing bugs in ttth',
                buttons: [
                    Noty.button('Yes', 'btn btn-success', function () {
                        n.close()
                        utils.writeConsoleMsg('warn', 'settingsToggleErrorReporting ::: Error reporting is now disabled')
                        writeLocalUserSetting('settingEnableErrorReporting', false)
                        sentry.disableSentry()
                        utils.showNoty('success', "<i class='fas fa-toggle-off'></i> <b>Option:</b> <u>Error Reporting</u> is now disabled.")
                    },
                    {
                        id: 'button1', 'data-status': 'ok'
                    }),

                    Noty.button('No', 'btn btn-secondary mediaDupes_btnDownloadActionWidth float-right', function () {
                        n.close()
                        $('#checkboxSettingErrorReporting').prop('checked', true) // revert state of checkbox
                        utils.showNoty('success', '<b>Thanks</b> for supporting ttth development with your error reports.')
                        utils.writeConsoleMsg('warn', 'settingsToggleErrorReporting ::: User cancelled disabling of error-reporting')
                        utils.showNoty('success', "<i class='fas fa-toggle-on'></i> <b>Option:</b> <u>Error Reporting</u> is now enabled.")
                    })
                ]
            })

        n.show() // show the noty dialog
    }
}




/**
* @function settingsToggleEnablePrereleases
* @summary Handles toggling the checkbox for the setting/option enable-preleases
* @description Handles toggling the checkbox for the setting/option enable-preleases
* @memberof renderer
*/
function settingsToggleEnablePrereleases() {
    utils.writeConsoleMsg('error', 'settingsToggleEnablePrereleases ::: Option EnablePrereleases was clicked.')

    if ($('#checkboxSettingEnablePrereleases').is(':checked')) {
        utils.writeConsoleMsg('info', 'settingsToggleEnablePrereleases ::: Pre-Releases is now enabled')
        writeLocalUserSetting('settingEnablePrereleases', true)
        utils.showNoty('success', "<i class='fas fa-toggle-on'></i> <b>Option:</b> <u>Enable Prereleases</u> is now enabled.")
    } else {
        utils.writeConsoleMsg('info', 'settingsToggleEnablePrereleases ::: Pre-Releases is now disabled')
        writeLocalUserSetting('settingEnablePrereleases', false)
        utils.showNoty('success', "<i class='fas fa-toggle-off'></i> <b>Option:</b> <u>Enable Prereleases</u> is now disabled.")
    }
}



/**
* @function fontAwesomeShowIconGallery
* @summary Reads all user configured service files and adds the enabled services as tabs
* @description Reads all user configured service files and adds the enabled services as tabs
* @memberof renderer
*/
function fontAwesomeShowIconGallery () {
    utils.openURL('https://fontawesome.com/icons?d=gallery&m=free')
}

/**
* @function loadEnabledUserServices
* @summary Reads all user configured service files and adds the enabled services as tabs
* @description Reads all user configured service files and adds the enabled services as tabs
* @memberof renderer
*/
function loadEnabledUserServices () {
    const storage = require('electron-json-storage')

    utils.writeConsoleMsg('info', 'loadEnabledUserServices ::: Starting to fetch all user configured service files')

    // loop over all json files - add tab for the enabled ones
    storage.getAll(function (error, data) {
        if (error) {
            utils.writeConsoleMsg('error', 'loadEnabledUserServices ::: Error whilew trying to get all enabled user services. Error: ' + error)
            throw error
        }

        // show object which contains all config files
        // utils.writeConsoleMsg("info", "loadEnabledUserServices ::: Object: " + data);
        // console.error(data);

        // loop over upper object
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                utils.writeConsoleMsg('info', 'loadEnabledUserServices ::: ' + key)
                utils.writeConsoleMsg('info', 'loadEnabledUserServices ::: ' + key + ' -> ' + data[key])

                // show enabled configured service
                if (data[key].serviceEnableStatus === true) {
                    utils.writeConsoleMsg('info', 'loadEnabledUserServices ::: Trying to add the enabled service: _' + key + '_.')
                    addServiceTab(key, data[key].type, data[key].name, data[key].icon, data[key].url, data[key].injectCode, data[key].userAgentDefault, data[key].userAgentCustom)
                } else {
                    utils.writeConsoleMsg('info', 'loadEnabledUserServices ::: Skipped service: _' + key + '_, as it not enabled.')
                }
            }
        }
        utils.writeConsoleMsg('info', 'loadEnabledUserServices ::: Finished current service: ' + data)
    })
}

/**
* @function deleteConfiguredService
* @summary Deletes a single configured user service
* @description Removes the tab, deletes the service user config, reloads the settings view which shows all user configured services.
* @memberof renderer
* @param {string} serviceId - the service id
*/
function deleteConfiguredService (serviceId) {
    utils.writeConsoleMsg('info', 'deleteConfiguredService ::: Deleting the user service: _' + serviceId + '_.')

    // cleanup after deleting the entire service
    // var webview = document.getElementById("webview_" + serviceId);

    // delete all Event handlers
    $('#webview_' + serviceId).unbind('did-start-loading')
    $('#webview_' + serviceId).unbind('dom-ready')
    $('#webview_' + serviceId).unbind('did-stop-loading')
    $('#webview_' + serviceId).unbind('ipc-message')
    $('#webview_' + serviceId).unbind('new-window')
    utils.writeConsoleMsg('warn', 'deleteConfiguredService ::: Deleted all event handlers from webview')

    // Delete the webview of this service
    $('#webview_' + serviceId).remove()
    utils.writeConsoleMsg('warn', 'deleteConfiguredService ::: Removed the webview itself')

    removeServiceTab(serviceId) // remove service tab in UI

    // delete json config of this service
    const storage = require('electron-json-storage')
    storage.remove(serviceId, function (error) {
        if (error) {
            utils.writeConsoleMsg('error', 'deleteConfiguredService ::: Error while trying to delete the user service: _' + serviceId + '_. Error: ' + error)
            throw error
        }
    })

    utils.writeConsoleMsg('info', 'deleteConfiguredService ::: Finished deleting the user service: _' + serviceId + '_.')
    utils.showNoty('success', 'Successfully deleted the service <b>' + serviceId + '</b>.')

    // reload the main window
    const { ipcRenderer } = require('electron')
    ipcRenderer.send('reloadMainWindow')
}

/**
* @function settingsUserAddNewService
* @summary user wants to configure a new service
* @description user wants to configure a new service. Gets called from mainWindow.html
* @memberof renderer
*/
function settingsUserAddNewService () {
    utils.writeConsoleMsg('info', 'settingsUserAddNewService ::: Starting to add a new user configured service.')

    const storage = require('electron-json-storage')

    // get selected option from #select_availableServices
    var userSelectedService = $('#select_availableServices').val()
    utils.writeConsoleMsg('info', 'settingsUserAddNewService ::: Selected service type is: _' + userSelectedService + '_.')

    if (userSelectedService !== null) {
        utils.writeConsoleMsg('info', 'settingsUserAddNewService ::: Should add a new service of type: _' + userSelectedService + '_.')

        // check if this service allows multiple instances
        utils.writeConsoleMsg('info', 'settingsUserAddNewService ::: Checking if the service: _' + userSelectedService + '_ allows multiple instances')

        // Parse service template
        // const url = __dirname + '/js/ttth/services.json'
        const path = require('path')
        const url = path.join(__dirname, '/js/ttth/services.json')

        $.getJSON(url, function (data) {
            $.each(data, function (key, entry) {
                if (entry.id === userSelectedService) {
                    // check if it allows multiple instances
                    if (entry.multiple === true) {
                        utils.writeConsoleMsg('info', 'settingsUserAddNewService ::: Service: _' + userSelectedService + '_ allows multiple instances')
                        // serviceAllowsMultipleInstances = true;

                        // send ipc to show second window
                        const { ipcRenderer } = require('electron')
                        ipcRenderer.send('showConfigureSingleServiceWindowNew', userSelectedService)
                    } else {
                        // single instance service
                        utils.writeConsoleMsg('warn', 'settingsUserAddNewService ::: Service: _' + userSelectedService + '_ does NOT allows multiple instances')
                        utils.writeConsoleMsg('info', 'settingsUserAddNewService ::: Check if there already exists an instance of the service type: _' + userSelectedService + '_.')

                        // check if there is already a configured service of that type.
                        // check which configs already exist
                        storage.getAll(function (error, data) {
                            if (error) {
                                utils.writeConsoleMsg('error', 'settingsUserAddNewService ::: Error while trying to get all user service configurations. Error: ' + error)
                                throw error
                            }

                            // show object which contains all config files
                            utils.writeConsoleMsg('info', data)

                            for (var key in data) {
                                if (data.hasOwnProperty(key)) {
                                    // utils.writeConsoleMsg("info", key + " -> " + data[key]);
                                    utils.writeConsoleMsg('info', data[key].type)

                                    if (data[key].type === userSelectedService) {
                                        utils.showNoty('error', 'There is already a configured service of the type <b>' + userSelectedService + '</b>.', 0)
                                        return
                                    }
                                }
                            }

                            const { ipcRenderer } = require('electron')
                            ipcRenderer.send('showConfigureSingleServiceWindowNew', userSelectedService)
                        })
                    }
                }
            })
        })
    } else {
        utils.writeConsoleMsg('warn', 'settingsUserAddNewService ::: No service type selected. Unable to add a new service.')
        utils.showNoty('error', 'No service type selected. Unable to add a new service.')
    }
}

/**
* @function generateNewRandomServiceID
* @summary Generates a config-file name while adding a new service
* @description Gets the serviceType and adds a random string. The outcome is the name for the new service config-file.
* @memberof renderer
* @param {string}  serviceType - The type of the service
* @return {string}  newServiceId - serviceType + Random string
*/
function generateNewRandomServiceID (serviceType) {
    var i = 0
    var length = 24
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var randomString = ''
    var newServiceId = ''

    // create random string
    for (i = 0; i < length; i++) {
        randomString += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    newServiceId = serviceType + '_' + randomString
    utils.writeConsoleMsg('info', 'generateNewRandomServiceID ::: Generated a new service ID: _' + newServiceId + '_.')
    return newServiceId
}

/**
* @function localizeUserInterface
* @summary Localizes the user interface
* @description Is using i18next to localize the user interface. Translations are located in app/locales/.
* @memberof renderer
* @param {string} windowName - ...
*/
function localizeUserInterface (windowName) {
    const isDev = require('electron-is-dev')
    const path = require('path')

    utils.writeConsoleMsg('info', 'localizeUserInterface ::: Localizing: _' + windowName + '_')

    // detect user language
    var userLang = navigator.language || navigator.userLanguage

    utils.writeConsoleMsg('info', 'localizeUserInterface ::: Detected user language: ' + userLang)

    // if the project is not packaged - overwrite the language ...
    if (isDev) {
        userLang = 'en' // to EN. This is used to ensure the screenshots are in the expected language
        // userLang = "pl"; // to PL. This is used to test unsupported languages
        utils.writeConsoleMsg('warn', 'localizeUserInterface ::: Overwritten user language in dev environment to: ' + userLang)
    }

    var i18next = require('i18next')
    var Backend = require('i18next-sync-fs-backend')

    i18next
        .use(Backend)
        .init({
            debug: true, // logs info-level to console output. Helps finding issues with loading not working.
            lng: userLang, // configured user language
            whitelist: ['en', 'de', 'fr'], // supported languages
            fallbackLng: 'en', // language to use if translations in user language are not available.
            ns: 'translation', // string or array of namespaces to load
            defaultNS: 'translation', // default namespace used if not passed to translation function
            updateMissing: false,
            initImmediate: true,
            backend:
        {
            // path where resources get loaded from
            // loadPath: __dirname + '/locales/{{lng}}/{{ns}}.json',
            loadPath: path.join(__dirname, '/locales/{{lng}}/{{ns}}.json'),

            // path to post missing resources
            // addPath: __dirname + '/locales/{{lng}}/{{ns}}.missing.json',
            addPath: path.join(__dirname, '/locales/{{lng}}/{{ns}}.missing.json'),

            // jsonIndent to use when storing json files
            jsonIndent: 2
        }
        })

    $(function () {
        // attribute: text
        $('[i18n-text]').each(function () {
            var node = $(this); var key = node.attr('i18n-text')
            node.text(i18next.t(key))
        })

        // attribute: title
        $('[i18n-title]').each(function () {
            var node = $(this); var key = node.attr('i18n-title')
            node.attr('title', i18next.t(key))
        })

        // attribute: placeholder
        $('[i18n-placeholder]').each(function () {
            var node = $(this); var key = node.attr('i18n-placeholder')
            node.attr('placeholder', i18next.t(key))
        })

        // attribute: value
        $('[i18n-value]').each(function () {
            var node = $(this); var key = node.attr('i18n-value')
            node.attr('value', i18next.t(key))
        })
    })
}

/**
* @function checkNetworkConnectivityPeriodic
* @summary Periodically checks if network access exists or not
* @description Testmethod to inform the user when there is no access to the internet.
* @memberof renderer
* @param {number} timeInterval - The time interval which is used to start re-testing
*/
function checkNetworkConnectivityPeriodic (timeInterval) {
    const isOnline = require('is-online') // for online connectivity checks
    var continuousErrors = 0
    var intervalID = setInterval(function () {
        (async () => {
            if (await isOnline() === true) {
                utils.writeConsoleMsg('info', 'checkNetworkConnectivityPeriodic ::: Got access to the internet.')
                continuousErrors = 0 // reset counter
            } else {
                continuousErrors = continuousErrors + 1
                // to avoid annoying notifications we report back only if the error happens X times in a row
                if (continuousErrors === 3) {
                    utils.showNoty('error', 'Realizing connectivity issues, please troubleshoot your internet connection if this message appears.')
                    continuousErrors = 0 // reset counter
                }
                utils.writeConsoleMsg('warn', 'checkNetworkConnectivityPeriodic ::: Got NO access to the internet (' + continuousErrors + ').')
            }
        })()
    }, timeInterval)
}

/**
* @function onMainWindowBeforeReady
* @summary Executed before onReady
* @description launcher for several init methods before jquerys ready signal. Gets called from mainWindow.html
* @memberof renderer
*/
function onMainWindowBeforeReady () {
    checkSupportedOperatingSystem() // check operating system
    titlebarInit() // init the custom titlebar - see #115
    uscu.updateAllUserServiceConfigurations() // update the configured UserServices (introduced with switch from 1.7.0 to 1.8.0)
    checkNetworkConnectivityPeriodic(10000) // start periodic network checker - 10.000 milliseconds = 10 seconds
    utils.writeConsoleMsg('info', 'onMainWindowBeforeReady( ::: Finished.')
}

/**
* @function onMainWindowAfterReady
* @summary Executed 1 sec after onReady code is executed
* @description This method is responsible for the second stage of loading & initializing.
* @memberof renderer
*/
function onMainWindowAfterReady () {
    updateGlobalServicesShortcuts() // update global shortcuts for all loaded / enabled services
    validateConfiguredDefaultView() // validate default view

    // Configure click-handler for navigation/tabs
    $('#myTabs a').click(function (link) {
        var target = link.currentTarget.innerText

        // remove leading space
        if (target.substr(0, 1) === ' ') {
            target = target.substr(1)
        }

        console.log('ready ::: Switched to tab: _' + target + '_.')
    })
    utils.writeConsoleMsg('info', 'onMainWindowAfterReady ::: Finished.')
}

/**
* @function onMainWindowReady
* @summary Initialized the application after jquerys ready signal
* @description launcher for several init methods after jquerys ready signal. Gets called from mainWindow.html
* @memberof renderer
*/
function onMainWindowReady () {
    loadEnabledUserServices() // load the configured user services
    initSettingsPage() // init the settings tab
    localizeUserInterface('mainWindow.html') // Translate using i18next

    setTimeout(function () {
        onMainWindowAfterReady() // executing some things later ...
    }, 1000)
    utils.writeConsoleMsg('info', 'onMainWindowReady ::: Finished.')
}

// ----------------------------------------------------------------------------
// ipcRenderer things
// ----------------------------------------------------------------------------

// Call from main.js ::: reloadCurrentService
//
require('electron').ipcRenderer.on('reloadCurrentService', function () {
    // get href of current active tab
    var tabValue = $('.nav-tabs .active').attr('href')
    tabValue = tabValue.substring(1) // cut the first char ( =  #)

    if (tabValue !== 'Settings') {
        utils.writeConsoleMsg('info', 'reloadCurrentService ::: Current active tab is: ' + tabValue)

        utils.showNoty('info', 'Trying to reload the current service: <b>' + tabValue + '</b>.')

        // Start animating
        doAnimateServiceIcon(true, tabValue)

        // get configured target url & inject code from config
        const storage = require('electron-json-storage')
        storage.get(tabValue, function (error, data) {
            if (error) {
                utils.writeConsoleMsg('error', 'reloadCurrentService ::: Error while trying to get a single user service configuration. Service: ' + tabValue + '. Error: ' + error)
                throw error
            }

            var url = data.url

            // Sentry: TTTH-3S
            if (typeof url === 'undefined') {
                // url is undefined
                utils.showNoty('error', 'Trying to reload service: <b>' + tabValue + '</b> failed, as URL is undefined.', 0)
                utils.writeConsoleMsg('error', 'reloadCurrentService ::: Reloading current active service: ' + tabValue + ' failed, as its URL is undefined.')
            } else {
                utils.writeConsoleMsg('info', 'reloadCurrentService ::: Set service  _' + tabValue + '_ URL of webview to: _' + url + '_.')
                document.getElementById('webview_' + tabValue).loadURL(url)
            }

            // TODO
            // inject code
            // var injectCode = data.injectCode;
        })
    }
})

// Call from main.js ::: showSettings
//
require('electron').ipcRenderer.on('showSettings', function () {
    utils.writeConsoleMsg('info', 'showSettings ::: Switching to Settings tab')
    switchToService('Settings')
})

// Call from main.js ::: startSearchUpdates
//
require('electron').ipcRenderer.on('startSearchUpdates', function () {
    utils.writeConsoleMsg('info', 'startSearchUpdates ::: Show update information div')
    searchUpdate(false) // silent = false. Forces result feedback, even if no update is available
})

// Call from main.js ::: openDevToolForCurrentService
//
require('electron').ipcRenderer.on('openDevToolForCurrentService', function () {
    // get href of current active tab
    var tabValue = $('.nav-tabs .active').attr('href')
    tabValue = tabValue.substring(1) // cut the first char ( =  #)

    // This makes no sense on the settings tab
    if (tabValue === 'Settings') {
        utils.showNoty('info', 'This function is supposed to be used on service tabs, not the settings tab.')
    } else {
        // default case
        utils.writeConsoleMsg('info', 'openDevToolForCurrentService ::: Trying to open DevTools for current service: _' + tabValue + '_.')
        var webview = document.getElementById('webview_' + tabValue) // get webview
        webview.openDevTools() // Open devTools
    }
})

// Call from main.js ::: nextTab
//
require('electron').ipcRenderer.on('nextTab', function () {
    // variables
    var currentTabId
    var enabledTabsArray = [] // should store all visible names
    var currentActiveTabId // Id of active tab
    var serviceName // used to call  the function switchToService()

    // get current selected / active tab
    currentActiveTabId = $('.nav-item .active').attr('id')
    currentActiveTabId = currentActiveTabId.replace('target_', '')
    utils.writeConsoleMsg('info', 'nextTab ::: Active tab is: ' + currentActiveTabId)

    // get list of all visible service-tabs
    $('#myTabs li a').each(function () {
        currentTabId = $(this).attr('id')

        // check if entry is visible or not
        if ($('#' + currentTabId).is(':visible')) {
            currentTabId = currentTabId.replace('target_', '')
            if (currentTabId !== 'Settings') {
                enabledTabsArray.push(currentTabId)
            }
        }
    })

    // find position of current tab in the array of enabled services
    var currentPositionInArray = enabledTabsArray.indexOf(currentActiveTabId)

    // get next array position
    if (currentPositionInArray < enabledTabsArray.length - 1) {
        serviceName = enabledTabsArray[currentPositionInArray + 1]
    } else {
        serviceName = enabledTabsArray[0]
    }

    utils.writeConsoleMsg('info', 'nextTab ::: Should switch to: ' + serviceName + ' now.')
    switchToService(serviceName) // jump to next tab
})

// Call from main.js ::: previousTab
//
require('electron').ipcRenderer.on('previousTab', function () {
    // variables
    var currentTabId
    var enabledTabsArray = [] // should store all visible names
    var currentActiveTabId // Id of active tab
    var serviceName // used to call  the function switchToService()

    // get current selected / active tab
    currentActiveTabId = $('.nav-item .active').attr('id')
    currentActiveTabId = currentActiveTabId.replace('target_', '')
    utils.writeConsoleMsg('info', 'previous ::: Active tab is: ' + currentActiveTabId)

    // get list of all visible service-tabs
    $('#myTabs li a').each(function () {
        currentTabId = $(this).attr('id')

        // check if entry is visible or not
        if ($('#' + currentTabId).is(':visible')) {
            currentTabId = currentTabId.replace('target_', '')
            if (currentTabId !== 'Settings') {
                enabledTabsArray.push(currentTabId)
            }
        }
    })

    // find position of current tab in the array of enabled services
    var currentPositionInArray = enabledTabsArray.indexOf(currentActiveTabId)

    // get previous array position
    if (currentPositionInArray > 0) {
        serviceName = enabledTabsArray[currentPositionInArray - 1]
    } else {
        serviceName = enabledTabsArray[enabledTabsArray.length - 1]
    }

    utils.writeConsoleMsg('info', 'previousTab ::: Should switch to: ' + serviceName + ' now.')
    switchToService(serviceName) // jump to previous tab
})

// Call from main.js ::: serviceToCreate (in configServiceWindow)
//
require('electron').ipcRenderer.on('serviceToCreate', function (event, serviceId) {
    utils.writeConsoleMsg('info', 'serviceToCreate ::: Should create a new service of type: _' + serviceId + '_.')
    utils.writeConsoleMsg('info', 'serviceToCreate ::: Loading default values from service definition')

    var newServiceId = generateNewRandomServiceID(serviceId) // generate id for new service

    // read json file
    const path = require('path')
    const url = path.join(__dirname, '/js/ttth/services.json')

    $.getJSON(url, function (data) {
        $.each(data, function (key, entry) {
            if (entry.id === serviceId) {
                // update UI with default values
                $('#input_serviceId').val(newServiceId)
                $('#input_serviceType').val(entry.id)
                $('#input_serviceName').val(entry.name)
                $('#input_serviceIcon').val(entry.icon)
                $('#input_serviceUrl').val(entry.url)
                $('#input_serviceInjectCode').val(entry.injectCode)
                $('#input_serviceEnableStatus').val(true)
                $('#input_serviceUserAgentDefault').val(entry.userAgentDefault)
                $('#input_serviceUserAgentCustom').val('')

                // button visibility
                $('#bt_saveExistingService').hide() // hide save buttons (only used for editing existing services)
                $('#bt_addNewService').show() // show the add-new-service button

                previewIcon() // preview the icon
                utils.writeConsoleMsg('info', 'serviceToCreate ::: Loaded default values for this service-type to UI')
            }
        })
    })
})

// Call from main.js ::: serviceToConfigure (in configServiceWindow)
//
require('electron').ipcRenderer.on('serviceToConfigure', function (event, serviceId) {
    const storage = require('electron-json-storage')

    utils.writeConsoleMsg('info', 'serviceToConfigure ::: Should configure the service: ' + serviceId)
    utils.writeConsoleMsg('info', 'serviceToConfigure ::: Loading current values from service config')

    storage.get(serviceId, function (error, data) {
        if (error) {
            utils.writeConsoleMsg('error', 'serviceToConfigure ::: Error while trying to load service data for the service: ' + serviceId + '. Error: ' + error)
            throw error
        }

        // update UI of second window
        $('#input_serviceId').val(serviceId)
        $('#input_serviceType').val(data.type)
        $('#input_serviceName').val(data.name)
        $('#input_serviceIcon').val(data.icon)
        $('#input_serviceUrl').val(data.url)
        $('#input_serviceInjectCode').val(data.injectCode)
        $('#input_serviceEnableStatus').val(data.serviceEnableStatus)
        $('#input_serviceUserAgentDefault').val(data.userAgentDefault)
        $('#input_serviceUserAgentCustom').val(data.userAgentCustom)

        // button visibility
        $('#bt_addNewService').hide() // hide Add-new-service button
        $('#bt_saveExistingService').show() // show the edit service  button

        previewIcon() // preview the icon
        utils.writeConsoleMsg('info', 'serviceToConfigure ::: Loaded current values for this service to UI')
    })
})

// Call from main.js ::: switchToTab
//
require('electron').ipcRenderer.on('switchToTab', function (event, targetTab) {
    utils.writeConsoleMsg('info', 'switchToTab ::: Switching to tab: ' + targetTab)
    $('#' + targetTab).trigger('click')
})

// Call from main.js :::
//
require('electron').ipcRenderer.on('showNoConnectivityError', function () {
    utils.writeConsoleMsg('error', 'showNoConnectivityError ::: There is no internet connection.')
    utils.showNoty('error', 'No access to the internet (critical) ', 0)
})

// Executed from main.js - on-ready-to-show
//
//
// Call from main.js ::: on-ready - startSearchUpdates
require('electron').ipcRenderer.on('startSearchUpdatesSilent', function () {
    searchUpdate(true) // If silent = false -> Forces result feedback, even if no update is available
})
