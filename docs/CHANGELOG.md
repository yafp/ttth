![logo](https://raw.githubusercontent.com/yafp/ttth/master/.github/images/logo/128x128.png)

# ttth
## changelog

This project is using [Semantic Versioning](https://semver.org/).

  `
  MAJOR.MINOR.PATCH
  `

* `MAJOR` version (incompatible API changes etc)
* `MINOR` version (adding functionality)
* `PATCH` version (bug fixes)

The following categories are used:

* `Added`: for new features
* `Changed`: for changes in existing functionality.
* `Deprecated`: for soon-to-be removed features.
* `Removed`: for now removed features.
* `Fixed`: for any bug fixes.
* `Security`: in case of vulnerabilities.


***

### ttth 1.9.0 (2020yyzz)
#### `Added`
* Settings
  * Added a new theme 'snazzy'. See [#157](https://github.com/yafp/ttth/issues/157)
  * Added theme support for application titlebar and service-tabs. See [#156](https://github.com/yafp/ttth/issues/156)
  * Added support for service-specific userAgents. See [#158](https://github.com/yafp/ttth/issues/158)
  * Added error handling for unhandled errors. See [#164](https://github.com/yafp/ttth/issues/164)
  * Added a new setting option to enable the search for updates to find pre-releases as well. See [#167](https://github.com/yafp/ttth/issues/167)
* Services
  * Discord: Adding link handler. See [#172](https://github.com/yafp/ttth/issues/172)
  * Discord: Adding unread message script. See [#173](https://github.com/yafp/ttth/issues/173)
* Added general support for UI animations using animate.css. See [#174](https://github.com/yafp/ttth/issues/174)
* Added support for command-line arguments using yargs. See [#181](https://github.com/yafp/ttth/issues/181)
* Added option to enable or disable the GPU acceleration. See [#188](https://github.com/yafp/ttth/issues/188)
* Inject code path is now validated before loading it to a service. See [#185](https://github.com/yafp/ttth/issues/185)
* Added support for spellchecker. See [#108](https://github.com/yafp/ttth/issues/108)

####  `Changed`
* Electron:
  * Updated to electron v8. See [#170](https://github.com/yafp/ttth/issues/170)
  * Updated to electron v9. See [#199](https://github.com/yafp/ttth/issues/199)
  * Updated to electron v10. See [#199](https://github.com/yafp/ttth/issues/200)
  * Updated to electron v11. See [#199](https://github.com/yafp/ttth/issues/201)
* Titlebar:
  * Removed unfocus effect. No color difference between focus and no-focus. See [#165](https://github.com/yafp/ttth/issues/165)
  * Added custom menu hover color for each theme. See [#166](https://github.com/yafp/ttth/issues/166)
* Error-Reporting:
  * This is now configurable. User can enable or disable error-reporting. See [#162](https://github.com/yafp/ttth/issues/162)
  * Removed any non error focused sentry usage. See [#163](https://github.com/yafp/ttth/issues/163)
* Settings:
  * Reduced right gap for 'configured services' by improving the css mess.
  * Reduced amount of buttons for the 'Options' -> Default view
  * Reduced amount of buttons for the 'Options' -> Theme
* Javascript Code: Moved some functions to modules
  * `app/js/ttth/modules/utils.js`
  * `app/js/ttth/modules/urlsGithub.js`
  * `app/js/ttth/modules/userServiceConfigUpdater.js`
* Noty
  * General: added support for animate.css effects. Now fading in and out. See [#174](https://github.com/yafp/ttth/issues/174)
  * confirm dialogs: changed button positions.
  * confirm dialogs: Preventing confirming the dialog without clicking a button
* Logging
  * Improved logging (added console messages for several existing error cases)
  * Added logging to several on error cases
  * Removed some renderer output to reduce flood of developer console.
  * Internal logging methods now support objects as well. See [#189](https://github.com/yafp/ttth/issues/189)
* Update search is now only executed on app start, not on earch UI reload anymore.
* jsdoc
  * is now using `docdash`
  * is now auto-generated on each commit. See [#178](https://github.com/yafp/ttth/issues/178)
* Builds
  * dmg: Improved macOS .dmg. New background image and new icon positions.
  * Windows Installer: Improved Windows Installer by adding new options to config. See [#169](https://github.com/yafp/ttth/issues/169)
* Dependencies
  * Updated `about-window` from `1.13.2` to `1.13.4`
  * Updated `animate.css` from `4.1.0` to `4.1.1`
  * Updated `bootstrap` from `4.4.1` to `4.6.0`
  * Updated `v8-compile-cache` from `2.1.0` to `2.2.0`
  * Updated `docdash` from `1.1.1` to `1.2.0`
  * Updated `electron` from `7.1.6` to `11.2.2`
  * Updated `electron-packager` from `14.1.1` to `15.2.0`
  * Updated `electron-util` from `0.13.1` to `0.14.2`
  * Updated `electron-is-dev` from `1.1.0` to `1.2.0`
  * Updated `electron-builder` from `22.2.0` to `22.9.1`
  * Updated `electron-log` from `4.0.0` to `4.3.1`
  * Updated `electron-json-storage` from `4.1.8` to `4.3.0`
  * Updated `eslint` from `6.7.2` to `7.19.0`
  * Updated `eslint-plugin-html` from `6.0.0` to `6.0.2`
  * Updated `fontawesome` from `5.12.0` to `5.15.2`
  * Updated `i18next` from `19.0.2` to `19.8.7`
  * Updated `is-online` from `8.2.1` to `9.0.0`
  * Updated `jquery` from `3.4.1` to `3.5.1`
  * Updated `jsdoc` from `3.6.3` to `3.6.6`
  * Updated `mocha` from `6.2.2` to `7.1.1`
  * Updated `popper.js` from `1.16.0` to `1.16.1`
  * Updated `rimraf` from `3.0.0` to `3.0.2`
  * Updated `sentry` from `1.1.0` to `2.2.0`
  * Updated `spectron` from `9.0.0` to `10.0.1`
  * Updated `standardx` from `5.0.0` to `7.0.0`
  * Updated `snazzy` from `8.0.0` to `9.0.0`
  * Updated `yargs` from `15.3.1` to `16.2.0`
  * Switched back from `pj-custom-electron-titlebar` to `custom-electron-titlebar` (`3.2.6`)

#### `Removed`
* Removed `npx` from project
* Removed `url.parse` as it is deprecated.

#### `Fixed`
* Fixed fallback in case of unset theme. See [#154](https://github.com/yafp/ttth/issues/154)
* Fixed login to google services. See [#155](https://github.com/yafp/ttth/issues/155)
* Fixed minor UI bug regarding different sized service-icons on settings page. See [#160](https://github.com/yafp/ttth/issues/160)
* Fixed a bug while reading and patching user-services-configurations. See [#171](https://github.com/yafp/ttth/issues/171)
* Fixed unread message count for Xing. See [#175](https://github.com/yafp/ttth/issues/175)
* Fixed an issue with twitter inject code. See [#182](https://github.com/yafp/ttth/issues/182)
* Fixed gmail popup issue. See [#190](https://github.com/yafp/ttth/issues/190)
* Fixed about window issue. See [#198](https://github.com/yafp/ttth/issues/198)
* Fixed electron-7-to-11 related issue. See [#202](https://github.com/yafp/ttth/issues/202)
* Fixed electron-7-to-11 related issue. See [#203](https://github.com/yafp/ttth/issues/203)


***

### ttth 1.8.0 (20191219)
#### `Added`
* Services:
  * Added support for `Gitter`. See [#140](https://github.com/yafp/ttth/issues/140)
  * Added support for `Steam Chat`. See [#135](https://github.com/yafp/ttth/issues/135)
  * Added support for `Wire`. See [#144](https://github.com/yafp/ttth/issues/144)
  * Skype: Added support for unread message counting. See [#133](https://github.com/yafp/ttth/issues/133)
  * Messenger: Added support for unread message counting. See [#132](https://github.com/yafp/ttth/issues/132)
* Network accessibility: Added a periodic check for network accessibility. See [#136](https://github.com/yafp/ttth/issues/136)
* Settings: Added support for more themes. See [#131](https://github.com/yafp/ttth/issues/131)
  * New theme: `Dracula`
  * New theme: `Nord`
  * New theme: `Solarized Dark`
  * New theme: `Solarized Light`
* Added animations to service-tab icons. See [#146](https://github.com/yafp/ttth/issues/146)
* Added warning to url click handler regarding non-https links. See [#147](https://github.com/yafp/ttth/issues/147)
* Added support for application badge count on macOS. See [#152](https://github.com/yafp/ttth/issues/152)

####  `Changed`
* Update check: The download link for new releases now opens in the default browser (previously in a new electron window). See [#150](https://github.com/yafp/ttth/issues/150)
* Changed update interval for single services from 5 to 3 seconds.
* electron
  * Updated electron from 5.0.11 to 6.1.3. See [#88](https://github.com/yafp/ttth/issues/88)
    * Chrome: 76.0.3809.146
    * Node: 12.4.0
  * Updated electron from 6.1.3 to 7.1.6. See [#138](https://github.com/yafp/ttth/issues/138)
    * Chrome: 78.0.3904.113
    * Node: 12.8.1
* Dependencies
  * Updated `about-window` from `1.13.1` to `1.13.2`
  * Updated `bootstrap` from `4.3.1` to `4.4.1`
  * Updated `electron-builder` from `21.2.0` to `22.2.0`
  * Updated `electron-packager` from `14.0.6` to `14.1.1`
  * Updated `electron-log` from `3.0.8` to `4.0.0`
  * Updated `eslint` from `6.5.1` to `6.7.2`
  * Updated `is-online` from `8.2.0` to `8.2.1`
  * Updated `i18next` from `17.2.0` to `19.0.2`
  * Updated `mocha` from `6.2.1` to `6.2.2`
  * Updated `pj-custom-electron-titlebar` from `3.1.3` to `3.1.6`
  * Updated `sentry` from `0.17.4` to `1.1.0`
  * Updated `spectron` from `8.0.0` to `9.0.0`
* CDNs vs NPM. See [#113](https://github.com/yafp/ttth/issues/113)
  * jquery is now included using npm. Using less cdn's is a good thing. See [#137](https://github.com/yafp/ttth/issues/137)
  * FontAwesome is now included using npm. Using less cdn's is a good thing. See [#148](https://github.com/yafp/ttth/issues/148)
  * Bootstrap is now included using npm. Using less cdn's is a good thing. See [#149](https://github.com/yafp/ttth/issues/149)
* Menu: Added a hover background color to the menu and its items. Should be easier now to see what is selected. See [#139](https://github.com/yafp/ttth/issues/139)
* Services: Enabled the inject files for the following services. See [#141](https://github.com/yafp/ttth/issues/141)
  * Google Mail
  * Google Messages
  * Slack
  * Telegram
  * Threema
  * Xing
* Notifications: Added more text formating (bold etc.) to notification texts
* Enabling autostart is no longer possible in non-packaged mode. This should help preventing creating autostart items for electron itself instead of ttth.
* JsDOC is now included in the dev environment. Should make doc generation easier for others.
* Javascript: Changed to Standard Javascript style. Using standardx to check the code.

#### `Removed`
* Removed the 'about' section on the settings tab. Cleanup. All links are accessible using the help menu. See [#142](https://github.com/yafp/ttth/issues/142)
* Removed the 'about' menuitem from the tray. See [#151](https://github.com/yafp/ttth/issues/151)
* Removed several un-used event listeners for all service-webviews. Slightly reducing the memory footprint
* Builds: No more .zip Builds for macOS

#### `Fixed`
* Fixed issue regarding non-existing mainWindow on macOS. See [#134](https://github.com/yafp/ttth/issues/134)

#### `Security`
* Fixed vulnerability in https-proxy-agent by updating sentry. See [#184](https://github.com/getsentry/sentry-electron/issues/184)

***

### ttth 1.7.0 (20191018)
#### `Added`
* Window titlebar now includes the menu. See [#115](https://github.com/yafp/ttth/issues/115)
* Added a first (pretty poor) version of french localication. See [#118](https://github.com/yafp/ttth/issues/118)
* Added error notification when service url failed to load. See [#119](https://github.com/yafp/ttth/issues/119)
* Added a menu item to the help menu to open DevTools for the current service. See [#120](https://github.com/yafp/ttth/issues/120)
* Services:
  * Added Reddit Chat. See [#121](https://github.com/yafp/ttth/issues/121)
  * Added WeChat. See [#122](https://github.com/yafp/ttth/issues/122)
  * Added Google Duo. See [#123](https://github.com/yafp/ttth/issues/123)
  * Added ICQ. See [#124](https://github.com/yafp/ttth/issues/124)
  * Added Microsoft Teams. See [#126](https://github.com/yafp/ttth/issues/126)
  * Added Microsoft Outlook. See [#127](https://github.com/yafp/ttth/issues/127)
* Performance: Added v8-compile-cache which might speed up ttth a bit.
* Builds: Added support for freebsd. See [#129](https://github.com/yafp/ttth/issues/129)

####  `Changed`
* Dependencies
  * Updated `electron` from `5.0.10` to `5.0.11`
  * Updated `i18next` from `17.0.17` to `17.2.0`

#### `Removed`
* Window title no longer shows the name of the current tab / service. Sideeffect of [#115](https://github.com/yafp/ttth/issues/115)
* Setting 'Hide menubar' is not longer needed. Sideeffect of [#115](https://github.com/yafp/ttth/issues/115)
* Menu: 'View' -> 'Toggle Menubar' is not longer nedded. Sideeffect of [#115](https://github.com/yafp/ttth/issues/115)
* Removed 'electron-unhandled' as it is currently causing more issues then use. See [#125](https://github.com/yafp/ttth/issues/125)

#### `Fixed`
* Cleaned up the css code. Sideeffect of [#115](https://github.com/yafp/ttth/issues/115)
* Fixed issue where fullscreen toggle caused display of previous hidden menubar on linux. See [#94](https://github.com/yafp/ttth/issues/94). Sideffect of [#115](https://github.com/yafp/ttth/issues/115)
* Fixed issue on disabling a service. See [#117](https://github.com/yafp/ttth/issues/117)
* Fixed issue with global shortcuts for services (when service amount > 9). See [#116](https://github.com/yafp/ttth/issues/116)
* Fixed noty is not defined error. See [#128](https://github.com/yafp/ttth/issues/128)
* Fixed several js lint errors

***

### ttth 1.6.0 (20191002)
#### `Added`
* Crash Reporting: See [#106](https://github.com/yafp/ttth/issues/106)
  * Added crashReporter for renderer.
  * Added support for Sentry (collects crash informations).
* Settings:
  * Added a new setting urgent-mode. See [#110](https://github.com/yafp/ttth/issues/110)
  * Added title descriptions for all user settings.
  * Added a button in settings view to open the folder which contains all user-setting json files.
* Menubar:
  * Added a new entry to help menu for quick access to FAQ. See [#111](https://github.com/yafp/ttth/issues/111)
  * Added a new entry to help menu for quick access to CHANGELOG. See [#112](https://github.com/yafp/ttth/issues/112)

####  `Changed`
* Improved (some) log messages
* Improved handling of file which stores window position and size. See [#109](https://github.com/yafp/ttth/issues/109)
* The urgent window notification (introduced in 1.5.0) is now optional as user-setting. See [#110](https://github.com/yafp/ttth/issues/110)
* Dependencies
  * Updated eslint from 6.4.0 to 6.5.1
  * Updated mocha from 6.2.0 to 6.2.1
  * Updated i18next from 17.0.16 to 17.0.17
* Third party js libraries
  * jquery: changed from LOCAL to CDN
  * Bootstrap: changed from LOCAL to CDN
  * FontAwesome: changed from LOCAL to CDN & updated from 5.10.2 to 5.11.2

#### `Removed`
* Maintenance: Removed 'clean local storage' from help menu. As side effect from [#107](https://github.com/yafp/ttth/issues/107)
* Removed javascript splash screen (cleanup -> jquery.modalLoading)

#### `Fixed`
* Settings: LocalStorage was broken in 1.5.0. This broke all user settings from the settings tab. Replaced with electron-json-storage. See [#107](https://github.com/yafp/ttth/issues/107)
* Window position and size was not properly saved on macOS (since 1.5.0). See [#109](https://github.com/yafp/ttth/issues/109)
* Maintenance: Fixed 'clear cache' function. See [#114](https://github.com/yafp/ttth/issues/114)

***

### ttth 1.5.0 (20190920)
#### `Added`
* Logging: Write a log file. See [#73](https://github.com/yafp/ttth/issues/73)
* Builds: Added .rpm build for linx. See [#78](https://github.com/yafp/ttth/issues/78)
* Services: Added basic support for linkedin. See [#79](https://github.com/yafp/ttth/issues/79)
* Services: Added basic support for Facebook Messenger. See [#80](https://github.com/yafp/ttth/issues/80)
* Services: Added support for Riot.im. See [#101](https://github.com/yafp/ttth/issues/101)
* Services: Added support for Skype. See [#103](https://github.com/yafp/ttth/issues/103)
* UI: Added icon preview to service-config-window. See [#85](https://github.com/yafp/ttth/issues/85)
* UI: Added button with link to FontAwesome icons to service-config-window. See [#86](https://github.com/yafp/ttth/issues/86)
* UI: Config window is now localized as well. See [#89](https://github.com/yafp/ttth/issues/89)
* UI: Added a basic DarkMode. See [#96](https://github.com/yafp/ttth/issues/96)
* Settings: Added new setting to disable tray. See [#98](https://github.com/yafp/ttth/issues/98)
* Added basic support for startup parameters. See [#82](https://github.com/yafp/ttth/issues/82)
* Added check if internet is accessible. See [#90](https://github.com/yafp/ttth/issues/90)
* Added support for urgent-window. See [#100](https://github.com/yafp/ttth/issues/100)
* Added about-window menuItem to tray. See [#104](https://github.com/yafp/ttth/issues/104)
* Added a crash reporter (local only). See [#105](https://github.com/yafp/ttth/issues/105)

####  `Changed`
* UI: Added localized titles for UI elements. See [#75](https://github.com/yafp/ttth/issues/75)
* Settings: Options - simplify autostart setup. See [#72](https://github.com/yafp/ttth/issues/72)
* Dependencies
  * Updated electron from 4.2.6 to 5.0.6. See [#37](https://github.com/yafp/ttth/issues/37)
  * Updated electron from 5.0.6 to 5.0.10
  * Removed some not-in-used dependencies. See [#91](https://github.com/yafp/ttth/issues/91)
  * Updated several dependencies. See [#92](https://github.com/yafp/ttth/issues/92)
    * Updated about-window from 1.13.0 to 1.13.1
    * Updated electron-packager from 13.1.1 to 14.0.1. See [#81](https://github.com/yafp/ttth/issues/81)
    * Updated electron-packager from 14.0.1 to 14.0.6
    * Updated electron-builder from 20.44.4 to 21.2.0
    * Updated electron-log from 3.0.6 to 3.0.7
    * Updated electron-json-storage from 4.1.6 to 4.1.8
    * Updated mocha from 6.1.4 to 6.2.0
    * Updated spectron from 5.0.0 to 8.0.0
    * Updated eslint from 5.16.0 to 6.4.0
    * Updated i18next from 15.1.3 to 17.0.16
  * Updated jquery from 3.3.1 to 3.4.1.
  * Updated font-awesome from 5.8.1 to 5.10.2
* Code: Slimdown main.js by moving menu code to separate file. [#95](https://github.com/yafp/ttth/issues/95)

#### `Deprecated`
* Removed ia32 builds for linux (deprecated via electron-packager 14.x). See [#93](https://github.com/yafp/ttth/issues/93)

#### `Fixed`
* Fixed global shortcuts for service-tabs. See [#74](https://github.com/yafp/ttth/issues/74)
* Fixed an error in calculation of the next tab position while adding new service tabs. See [#77](https://github.com/yafp/ttth/issues/77)
* UI: No single element on settings tab is now selectable anymore using CTRL + a.
* Travis: Building linux builds via travis was broken since rpm-support was added ([#78](https://github.com/yafp/ttth/issues/78)). This is now fixed. See [#83](https://github.com/yafp/ttth/issues/83)

***

### ttth 1.4.0 (20190712)
####  `Added`
* Services: Added support for unread DM count for the service 'Twitter'. See [#49](https://github.com/yafp/ttth/issues/49)
* Services: Allow multiple instances of some services (example: Slack/Mattermost). See [#52](https://github.com/yafp/ttth/issues/52)
* Services: Added Dropbox as new service. See [#55](https://github.com/yafp/ttth/issues/55)
* Services: Added Discord as new service. See [#59](https://github.com/yafp/ttth/issues/59)
* Services: Added Nextcloud as new service. See [#57](https://github.com/yafp/ttth/issues/57)
* Services: Added Custom service (user url). See [#64](https://github.com/yafp/ttth/issues/64)
* Services: Added accesskeys for each service tab. See [#50](https://github.com/yafp/ttth/issues/50)
* Services: Added global shortcuts for each service tab. See [#71](https://github.com/yafp/ttth/issues/71)
* UI: Added in-app notifications (using Noty). See [#58](https://github.com/yafp/ttth/issues/58)
* UI: Added button to open the folder which contains all user configured service config files. See [#70](https://github.com/yafp/ttth/issues/70)

#### `Changed`
* UI: Remove left and right border. See [#51](https://github.com/yafp/ttth/issues/51)
* Services: Redesign of services-definitions and user configured services. See [#47](https://github.com/yafp/ttth/issues/47)
* Services: Generalize the event listener code for services. See [#63](https://github.com/yafp/ttth/issues/63)
* Dependencies
  * Updated electron from 4.2.0 to 4.2.6. [#66](https://github.com/yafp/ttth/issues/66)
  * Updated electron-builder from 20.40.2 to 20.44.4. [#67](https://github.com/yafp/ttth/issues/67)

#### `Removed`
* UI: Removed css user styles. See [#61](https://github.com/yafp/ttth/issues/61)
* Removed electron-prompt dependency. See [#69](https://github.com/yafp/ttth/issues/69)
* Removed logo image on bottom of settings tab. See [#68](https://github.com/yafp/ttth/issues/68)

#### `Fixed`
* Services: Fixed reloading of single service. See [#62](https://github.com/yafp/ttth/issues/62)
* UI: Fix horizontal scrollbar css bug. See [#60](https://github.com/yafp/ttth/issues/60)

***

### ttth 1.3.0 (20190603)
####  `Added`
* Services: Added new service 'Xing'. See [#26](https://github.com/yafp/ttth/issues/26)
* Services: Added new service 'Google Drive'. See [#33](https://github.com/yafp/ttth/issues/33)
* Menu: Added 'Reload current service' function (View -> Reload current service). See [#9](https://github.com/yafp/ttth/issues/9)
* Menu: Added 'Hide'  function (Window -> Hide). See [#11](https://github.com/yafp/ttth/issues/11)
* Menu: Added 'Clear cache' function (Help -> Cleaner -> Clear cache). See [#39](https://github.com/yafp/ttth/issues/39)
* Menu: Added 'Clear local storage' function (Help -> Cleaner -> Clear local storage). See [#40](https://github.com/yafp/ttth/issues/40)
* Setting: Added support for css color styles. See [#30](https://github.com/yafp/ttth/issues/30)
* UI: Added splash screen. See [#32](https://github.com/yafp/ttth/issues/32)

#### `Changed`
* UI: Window title now features name and version (before: only name). See [#25](https://github.com/yafp/ttth/issues/25)
* UI: Added placeholder text to input fields of electron-prompts. See [#28](https://github.com/yafp/ttth/issues/28)
* UI: Remove tab text from Settings tab. Just show the icon. See [#29](https://github.com/yafp/ttth/issues/29)
* UI: Window title now features the name of the frontmost service. See [#41](https://github.com/yafp/ttth/issues/41)
* UI: Shrinked tabs to save space. See See [#45](https://github.com/yafp/ttth/issues/45)
* Menu: Minimize is now CTRL + M (Window -> Minimize). See [#11](https://github.com/yafp/ttth/issues/11)
* Menu: Maximize is now CTRL + K (Window -> Maximize). See [#11](https://github.com/yafp/ttth/issues/11)
* Update search: manually searching for updates shows now always the result. See [#36](https://github.com/yafp/ttth/issues/36)
* Electron: Update from 4.1.4 to 4.2.2.

#### `Removed`
* UI: Removed transparency / opacity behaviour. See [#34](https://github.com/yafp/ttth/issues/34)

#### `Fixed`
* UI: Prompt for 'Slack' and 'Mattermost' now show the app icon instead of the default icon. See [#31](https://github.com/yafp/ttth/issues/31)
* UI: Reloading resetted the application title. [#44](https://github.com/yafp/ttth/issues/44)
* Services: Slack was loading the wrong url - which resulted in a white screen. See [#35](https://github.com/yafp/ttth/issues/35)
* Services: Mattermost was not setting the correct url to the webview after enabling it. See [#38](https://github.com/yafp/ttth/issues/38)
* Services: When a user tried to enable Mattermost or Slack and cancelled the prompt, the service status button was still green. Is now fixed. See [#42](https://github.com/yafp/ttth/issues/42)
* Services: Unread Message count for Whatsapp was broken. See [#46](https://github.com/yafp/ttth/issues/46)

***

### ttth 1.2.0 (20190524)
####  `Added`
* Window: changes opacity (from 1.0 to 0.9) if it loses focus (macOS/Windows only). See [#17](https://github.com/yafp/ttth/issues/17)
* Menu: Added 'Settings' entry to menubar (File -> Settings). See [#11](https://github.com/yafp/ttth/issues/11)
* Menu: Added 'Minimize' entry to menubar (Window -> Minimize). See [#11](https://github.com/yafp/ttth/issues/11)
* Menu: Added 'Maximize' entry to menubar (Window -> Maximize). See [#11](https://github.com/yafp/ttth/issues/11)
* Setting: Added 'Hide menubar' option to startup section of Settings. (for Linux and Windows) See [#18](https://github.com/yafp/ttth/issues/18)
* Update Information: Added close button to update-information. See [#20](https://github.com/yafp/ttth/issues/20)
* Added missing url handler for the services GoogleMail and GoogleMessages

#### `Changed`
* Settings: AutoStart on macOS should now use LaunchAgent (no longer AppleScript). See [#13](https://github.com/yafp/ttth/issues/13)
* Settings: Now showing 2 services per line to reduce vertical space-usage. See [#14](https://github.com/yafp/ttth/issues/14)
* Menubar: F12 now toggles the console (Help -> Console). See [#15](https://github.com/yafp/ttth/issues/15)
* Menubar: F10 now toggles the menubar (View -> Toggle Menubar). Was F3 before. See [#16](https://github.com/yafp/ttth/issues/16)
* UI: Improved CSS -> reducing the borders on left/white/bottom. See [#19](https://github.com/yafp/ttth/issues/19)
* Service Slack: Added handling for custom workspace definition. See [#22](https://github.com/yafp/ttth/issues/22)

#### `Fixed`
* Mac: Copy and paste was not working. Fixed by adding an 'Edit' section to the menu. See [#23](https://github.com/yafp/ttth/issues/23)

***

### ttth 1.1.0 (20190521)
####  `Added`
* Menu: Added console entry to view menu, see [#6](https://github.com/yafp/ttth/issues/6)
* Services: Added unread message function for GoogleMessages, see [#7](https://github.com/yafp/ttth/issues/7)

#### `Changed`
* UI: Changed the app icon, see [#5](https://github.com/yafp/ttth/issues/5)
* Settings: Optimized settings view for smaller screens, see [#4](https://github.com/yafp/ttth/issues/4)
* Operating systems: Windows and macOS are now officially supported, see [#3](https://github.com/yafp/ttth/issues/3)

#### `Removed`
* Settings: Removed the app version from settings view, see [#4](https://github.com/yafp/ttth/issues/4)

#### `Fixed`
* Settings: Fixing broken load default-view function, see [#1](https://github.com/yafp/ttth/issues/1)
* Service: Fixed url handling. Should now open clicks on urls in external browser (implemented for Freenode, Mattermost, Slack, Telegram, Whatsapp). See [#8](https://github.com/yafp/ttth/issues/8)
* Mac: Fixed some issues with the tray icon on macOS. See [#10](https://github.com/yafp/ttth/issues/10)

***

### ttth 1.0.0 (20190517)
####  `Added`
* Initial version,
* Operating systems
  * linux (tested)
  * windows (almost untested)
  * mac (not supported so far)
* Electron: 4.1.4
* Javascript libraries
  * jQuery: 3.3.1
  * BootStrap: 4.3.1
  * FontAwesome: 5.8.1
  * SemVer: 2.0.0
* Settings
  * Lists external links to issues, license etc
  * Gives access to developer console
  * Enable and disable available services
  * Shows status of each service
  * Startup options
    * Define default view on start
    * Configure autostart
    * Configure autostart option minimized
* Services:
  * Freenode
  * GitHub
  * Google Calendar
  * Google Contacts
  * Google Keep
  * Google Mail (minimal support for unread messages)
  * Google Messages
  * Google Photos
  * Mattermost (minimal support for unread messages)
  * Slack (minimal support for unread messages)
  * Telegram (minimal support for unread messages)
  * Threema (minimal support for unread messages)
  * Twitter
  * WhatsApp Web (minimal support for unread messages)
* Basic tray icon
* Basic notifications
* Basic support for localization using i18next (en / de)
* Basic jsdoc documentation
* Check for new releases on startup
* Forcing single app instance
