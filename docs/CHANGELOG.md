![logo](https://raw.githubusercontent.com/yafp/ttth/master/.github/logo/128x128.png)

# ttth
## changelog


### ttth 1.5.0 (2019xxyy)
#### ```Added```
* Logging: Write a log file. See [#73](https://github.com/yafp/ttth/issues/73)
* Builds: Added .rpm build for linx. See [#78](https://github.com/yafp/ttth/issues/78)
* Services: Added basic support for linkedin. See [#79](https://github.com/yafp/ttth/issues/79)
* Services: Added basic support for Facebook Messenger. See [#80](https://github.com/yafp/ttth/issues/80)
* UI: Added icon preview to service-config-window. See [#85](https://github.com/yafp/ttth/issues/85)
* UI: Added button with link to FontAwesome icons to service-config-window. See [#86](https://github.com/yafp/ttth/issues/86)
* UI: Config window is now localized as well. See [#89](https://github.com/yafp/ttth/issues/89)
* Added basic support for startup parameters. See [#82](https://github.com/yafp/ttth/issues/82)
* Added check if internet is accessible. See [#90](https://github.com/yafp/ttth/issues/90)
* Added a basic DarkMode. See [#96](https://github.com/yafp/ttth/issues/96)
* Added support for Riot.im. See [#101](https://github.com/yafp/ttth/issues/101)
* Added new setting to disable tray. See [#98](https://github.com/yafp/ttth/issues/98)
* Added support for urgent-window. See [#100](https://github.com/yafp/ttth/issues/100)

####  ```Changed```
* UI: Added localized titles for UI elements. See [#75](https://github.com/yafp/ttth/issues/75)
* Settings: Options - simplify autostart setup. See [#72](https://github.com/yafp/ttth/issues/72)
* Dependencies
  * Updated electron from 4.2.6 to 5.0.6. See [#37](https://github.com/yafp/ttth/issues/37)
  * Updated electron from 5.0.6 to 5.0.7
  * Updated electron from 5.0.7 to 6.0.6. See [#88](https://github.com/yafp/ttth/issues/88)
  * Removed some not-in-used dependencies. See [#91](https://github.com/yafp/ttth/issues/91)
  * Updated several dependencies. See [#92](https://github.com/yafp/ttth/issues/92)
    * Updated about-window from 1.13.0 to 1.13.1
    * Updated electron-packager from 13.1.1 to 14.0.1. See [#81](https://github.com/yafp/ttth/issues/81)
    * Updated electron-packager from 14.0.1 to 14.0.2
    * Updated electron-packager from 14.0.2 to 14.0.4
    * Updated electron-packager from 14.0.4 to 14.0.5
    * Updated electron-builder from 20.44.4 to 21.1.1
    * Updated electron-builder from 21.1.1 to 21.1.5
    * Updated electron-builder from 21.1.5 to 21.2.0
    * Updated electron-log from 3.0.6 to 3.0.7
    * Updated mocha from 6.1.4 to 6.2.0
    * Updated spectron from 5.0.0 to 7.0.0
    * Updated spectron from 7.0.0 to 8.0.0
    * Updated eslint from 5.16.0 to 6.2.2
    * Updated i18next from 15.1.3 to 17.0.6
    * Updated i18next from 17.0.6 to 17.0.7
    * Updated i18next from 17.0.7 to 17.0.8
    * Updated i18next from 17.0.8 to 17.0.9
    * Updated i18next from 17.0.9 to 17.0.13
    * Updated electron-json-storage from 4.1.6 to 4.1.7

* Code: Slimdown main.js by moving menu code to separate file. [#95](https://github.com/yafp/ttth/issues/95)

#### ```Deprecated```
* Removed ia32 builds for linux (deprecated via electron-packager 14.x). See [#93](https://github.com/yafp/ttth/issues/93)

#### ```Fixed```
* Fixed global shortcuts for service-tabs. See [#74](https://github.com/yafp/ttth/issues/74)
* Fixed an error in calculation of the next tab position while adding new service tabs. See [#77](https://github.com/yafp/ttth/issues/77)
* UI: No single element on settings tab is now selectable anymore using CTRL + a.
* Travis: Building linux builds via travis was broken since rpm-support was added ([#78](https://github.com/yafp/ttth/issues/78)). This is now fixed. See [#83](https://github.com/yafp/ttth/issues/83)






### ttth 1.4.0 (20190712)
####  ```Added```
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

#### ```Changed```
* UI: Remove left and right border. See [#51](https://github.com/yafp/ttth/issues/51)
* Services: Redesign of services-definitions and user configured services. See [#47](https://github.com/yafp/ttth/issues/47)
* Services: Generalize the event listener code for services. See [#63](https://github.com/yafp/ttth/issues/63)
* Dependencies
  * Updated electron from 4.2.0 to 4.2.6. [#66](https://github.com/yafp/ttth/issues/66)
  * Updated electron-builder from 20.40.2 to 20.44.4. [#67](https://github.com/yafp/ttth/issues/67)

#### ```Removed```
* UI: Removed css user styles. See [#61](https://github.com/yafp/ttth/issues/61)
* Removed electron-prompt dependency. See [#69](https://github.com/yafp/ttth/issues/69)
* Removed logo image on bottom of settings tab. See [#68](https://github.com/yafp/ttth/issues/68)

#### ```Fixed```
* Services: Fixed reloading of single service. See [#62](https://github.com/yafp/ttth/issues/62)
* UI: Fix horizontal scrollbar css bug. See [#60](https://github.com/yafp/ttth/issues/60)


### ttth 1.3.0 (20190603)
####  ```Added```
* Services: Added new service 'Xing'. See [#26](https://github.com/yafp/ttth/issues/26)
* Services: Added new service 'Google Drive'. See [#33](https://github.com/yafp/ttth/issues/33)
* Menu: Added 'Reload current service' function (View -> Reload current service). See [#9](https://github.com/yafp/ttth/issues/9)
* Menu: Added 'Hide'  function (Window -> Hide). See [#11](https://github.com/yafp/ttth/issues/11)
* Menu: Added 'Clear cache' function (Help -> Cleaner -> Clear cache). See [#39](https://github.com/yafp/ttth/issues/39)
* Menu: Added 'Clear local storage' function (Help -> Cleaner -> Clear local storage). See [#40](https://github.com/yafp/ttth/issues/40)
* Setting: Added support for css color styles. See [#30](https://github.com/yafp/ttth/issues/30)
* UI: Added splash screen. See [#32](https://github.com/yafp/ttth/issues/32)

#### ```Changed```
* UI: Window title now features name and version (before: only name). See [#25](https://github.com/yafp/ttth/issues/25)
* UI: Added placeholder text to input fields of electron-prompts. See [#28](https://github.com/yafp/ttth/issues/28)
* UI: Remove tab text from Settings tab. Just show the icon. See [#29](https://github.com/yafp/ttth/issues/29)
* UI: Window title now features the name of the frontmost service. See [#41](https://github.com/yafp/ttth/issues/41)
* UI: Shrinked tabs to save space. See See [#45](https://github.com/yafp/ttth/issues/45)
* Menu: Minimize is now CTRL + M (Window -> Minimize). See [#11](https://github.com/yafp/ttth/issues/11)
* Menu: Maximize is now CTRL + K (Window -> Maximize). See [#11](https://github.com/yafp/ttth/issues/11)
* Update search: manually searching for updates shows now always the result. See [#36](https://github.com/yafp/ttth/issues/36)
* Electron: Update from 4.1.4 to 4.2.2.

#### ```Removed```
* UI: Removed transparency / opacity behaviour. See [#34](https://github.com/yafp/ttth/issues/34)

#### ```Fixed```
* UI: Prompt for 'Slack' and 'Mattermost' now show the app icon instead of the default icon. See [#31](https://github.com/yafp/ttth/issues/31)
* UI: Reloading resetted the application title. [#44](https://github.com/yafp/ttth/issues/44)
* Services: Slack was loading the wrong url - which resulted in a white screen. See [#35](https://github.com/yafp/ttth/issues/35)
* Services: Mattermost was not setting the correct url to the webview after enabling it. See [#38](https://github.com/yafp/ttth/issues/38)
* Services: When a user tried to enable Mattermost or Slack and cancelled the prompt, the service status button was still green. Is now fixed. See [#42](https://github.com/yafp/ttth/issues/42)
* Services: Unread Message count for Whatsapp was broken. See [#46](https://github.com/yafp/ttth/issues/46)


### ttth 1.2.0 (20190524)
####  ```Added```
* Window: changes opacity (from 1.0 to 0.9) if it loses focus (macOS/Windows only). See [#17](https://github.com/yafp/ttth/issues/17)
* Menu: Added 'Settings' entry to menubar (File -> Settings). See [#11](https://github.com/yafp/ttth/issues/11)
* Menu: Added 'Minimize' entry to menubar (Window -> Minimize). See [#11](https://github.com/yafp/ttth/issues/11)
* Menu: Added 'Maximize' entry to menubar (Window -> Maximize). See [#11](https://github.com/yafp/ttth/issues/11)
* Setting: Added 'Hide menubar' option to startup section of Settings. (for Linux and Windows) See [#18](https://github.com/yafp/ttth/issues/18)
* Update Information: Added close button to update-information. See [#20](https://github.com/yafp/ttth/issues/20)
* Added missing url handler for the services GoogleMail and GoogleMessages

#### ```Changed```
* Settings: AutoStart on macOS should now use LaunchAgent (no longer AppleScript). See [#13](https://github.com/yafp/ttth/issues/13)
* Settings: Now showing 2 services per line to reduce vertical space-usage. See [#14](https://github.com/yafp/ttth/issues/14)
* Menubar: F12 now toggles the console (Help -> Console). See [#15](https://github.com/yafp/ttth/issues/15)
* Menubar: F10 now toggles the menubar (View -> Toggle Menubar). Was F3 before. See [#16](https://github.com/yafp/ttth/issues/16)
* UI: Improved CSS -> reducing the borders on left/white/bottom. See [#19](https://github.com/yafp/ttth/issues/19)
* Service Slack: Added handling for custom workspace definition. See [#22](https://github.com/yafp/ttth/issues/22)

#### ```Fixed```
* Mac: Copy and paste was not working. Fixed by adding an 'Edit' section to the menu. See [#23](https://github.com/yafp/ttth/issues/23)


### ttth 1.1.0 (20190521)
####  ```Added```
* Menu: Added console entry to view menu, see [#6](https://github.com/yafp/ttth/issues/6)
* Services: Added unread message function for GoogleMessages, see [#7](https://github.com/yafp/ttth/issues/7)

#### ```Changed```
* UI: Changed the app icon, see [#5](https://github.com/yafp/ttth/issues/5)
* Settings: Optimized settings view for smaller screens, see [#4](https://github.com/yafp/ttth/issues/4)
* Operating systems: Windows and macOS are now officially supported, see [#3](https://github.com/yafp/ttth/issues/3)

#### ```Removed```
* Settings: Removed the app version from settings view, see [#4](https://github.com/yafp/ttth/issues/4)

#### ```Fixed```
* Settings: Fixing broken load default-view function, see [#1](https://github.com/yafp/ttth/issues/1)
* Service: Fixed url handling. Should now open clicks on urls in external browser (implemented for Freenode, Mattermost, Slack, Telegram, Whatsapp). See [#8](https://github.com/yafp/ttth/issues/8)
* Mac: Fixed some issues with the tray icon on macOS. See [#10](https://github.com/yafp/ttth/issues/10)


### ttth 1.0.0 (20190517)
####  ```Added```
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



## About versioning
This project is using [Semantic Versioning](https://semver.org/).

  ```
  MAJOR.MINOR.PATCH
  ```

* ```MAJOR``` version (incompatible API changes etc)
* ```MINOR``` version (adding functionality)
* ```PATCH``` version (bug fixes)


### Categories
* ```Added```: for new features
* ```Changed```: for changes in existing functionality.
* ```Deprecated```: for soon-to-be removed features.
* ```Removed```: for now removed features.
* ```Fixed```: for any bug fixes.
* ```Security```: in case of vulnerabilities.
