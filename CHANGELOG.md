# ttth
## changelog

### ttth 1.1.0 (2019xxyy)
####  ```Added```
* Menu: Added console entry to view menu, see #6
* Services: Added unread message function for GoogleMessages, see #7

####```Changed```
* UI: Changed the app icon, see #5
* Settings: Optimized settings view for smaller screens, see #4
* Operating systems: Windows is now officially supported, see #3

#### ```Removed```
* Settings: Removed the app version from settings view, see #4

#### ```Fixed```
* Settings: Fixing broken load default-view function, see #1



### ttth 1.0.0 (20190517)
####  ```Added```
* Initial version,
* Ooperating systems
  * linux (tested)
  * windows ( almost untested)
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




## Versioning

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
