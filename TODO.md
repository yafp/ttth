![logo](https://raw.githubusercontent.com/yafp/ttth/master/.github/logo/128x128.png)

# ttth
## todos
* Build: find a way to minify js-code on build (using uglify or similar)
* lint via package-json script using eslint: https://medium.com/the-node-js-collection/why-and-how-to-use-eslint-in-your-project-742d0bc61ed7

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
* matcha - to benchmark the code

## Reminder: Source for unread message functions
* Rambox
  * app/store/ServicesList.js
* Franz: Features single repos for each recipt / service
  * Example WhatsApp: https://github.com/meetfranz/recipe-whatsapp
