![logo](https://raw.githubusercontent.com/yafp/ttth/master/.github/logo/128x128.png)

# ttth
## todos
* Build: find a way to minify js-code on build (using uglify or similar)
* Via DevTron: asar archiv - see: https://electronjs.org/docs/tutorial/application-packaging


## maybe / ideas / brainstorming
* Services
  * Discord?
  * Google Duo (video -> webcam)?
  * linkedin?
  * skype?
* FontAwesome
  * Slim it down (size-wise) - see: https://blog.webjeda.com/optimize-fontawesome/ - maybe using: IcoMoon
* Builds:
  * Linux: pacman?
* Context Menu (in WebView)
  * v1: electron-context-menu: https://github.com/sindresorhus/electron-context-menu
  * v2: electron-editor-context-menu: https://www.npmjs.com/package/electron-editor-context-menu
* Dialogs
  * check 'dialogs' vs 'electron-prompt'
* Consider using latest electron version (currently: 4.x vs available: 5.x)
* Updater
  * 'nuts' for pushing out updates to electron applications. Based on Github Releases
  * 'electron-release-server'
  * 'squirrel-updates-server'
  * 'auto-updater'
  * 'Electron-gh-releases'
* Package: 'temp' for handling temporary files
* Package: 'electron-dl' for handling downloads
* Spectron (and mocha)-  framework for integrations tests within an Electron application -> do it
    * https://github.com/electron/spectron
* matcha - to benchmark the code

## Reminder: Source for unread message functions
* Rambox: app/store/ServicesList.js
