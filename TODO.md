![logo](https://raw.githubusercontent.com/yafp/ttth/master/.github/logo/128x128.png)

# ttth
## todos
* Build: find a way to minify js-code on build (using uglify or similar)



## maybe / ideas / brainstorming
* Services
  * Google Duo (video -> webcam)?
  * linkedin?
  * skype?
* FontAwesome
  * Slim it down (size-wise) - see: https://blog.webjeda.com/optimize-fontawesome/ - maybe using: IcoMoon
  * Integration via webpack: https://discuss.atom.io/t/including-font-awesome-in-electron-build/40090
  * as dependecy: https://www.npmjs.com/package/font-awesome looks outdated
* Builds:
* Context Menu (in WebView)
  * v1: electron-context-menu: https://github.com/sindresorhus/electron-context-menu
  * v2: electron-editor-context-menu: https://www.npmjs.com/package/electron-editor-context-menu
* Updater
  * official way for win & macos: https://electronjs.org/docs/tutorial/updates
  * 'nuts' for pushing out updates to electron applications. Based on Github Releases
  * 'electron-release-server'
  * 'squirrel-updates-server'
  * 'auto-updater'
  * 'Electron-gh-releases'
* Code-Sign: for windows and macOS - required for auto-updates: https://electronjs.org/docs/tutorial/code-signing

## Reminder: Source for unread message functions
* Rambox
  * app/store/ServicesList.js
* Franz (single repos for each recipt / service)
  * Example WhatsApp: https://github.com/meetfranz/recipe-whatsapp
