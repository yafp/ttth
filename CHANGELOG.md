![logo](https://raw.githubusercontent.com/yafp/ttth/master/.github/logo/128x128.png)

# ttth
## changelog

### ttth 1.3.0 (2019xxyy)
####  ```Added```
* Services: Added new service 'Xing'. See #26
* Menu: Added 'Reload current service' function (View -> Reload current service). See #9

#### ```Changed```
* Window: Window title now features name and version (before: only name). See #25


### ttth 1.2.0 (20190524)
####  ```Added```
* Window: changes opacity (from 1.0 to 0.9) if it loses focus (macOS/Windows only). See #17
* Menu: Added 'Settings' entry to menubar (File -> Settings). See #11
* Menu: Added 'Minimize' entry to menubar (Window -> Minimize). See #11
* Menu: Added 'Maximize' entry to menubar (Window -> Mazimize). See #11
* Setting: Added 'Hide menubar' option to startup section of Settings. (for Linux and Windows) See #18
* Update Information: Added close button to update-information. See #20
* Added missing url handler for the services GoogleMail and GoogleMessages

#### ```Changed```
* Settings: AutoStart on macOS should now use LaunchAgent (no longer AppleScript). See #13
* Settings: Now showing 2 services per line to reduce vertical space-usage. See #14
* Menubar: F12 now toggles the console (Help -> Console). See #15
* Menubar: F10 now toggles the menubar (View -> Toggle Menubar). Was F3 before. See #16
* UI: Improved CSS -> reducing the borders on left/white/bottom. See #19
* Service Slack: Added handling for custom workspace definition. See #22 (untested due to missing slack account)

#### ```Fixed```
* Mac: Copy and paste was not working. Fixed by adding an 'Edit' section to the menu. See #23


### ttth 1.1.0 (20190521)
####  ```Added```
* Menu: Added console entry to view menu, see #6
* Services: Added unread message function for GoogleMessages, see #7

#### ```Changed```
* UI: Changed the app icon, see #5
* Settings: Optimized settings view for smaller screens, see #4
* Operating systems: Windows and macOS are now officially supported, see #3

#### ```Removed```
* Settings: Removed the app version from settings view, see #4

#### ```Fixed```
* Settings: Fixing broken load default-view function, see #1
* Service: Fixed url handling. Should now open clicks on urls in external browser (implemented for Freenode, Mattermost, Slack, Telegram, Whatsapp). See #8
* Mac: Fixed some issues with the tray icon on macOS. See #10


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
