![logo](https://raw.githubusercontent.com/yafp/ttth/master/.github/logo/128x128.png)

# ttth
## notes

### ideas  and brainstorming
* Services
  * Google Duo (video -> webcam)?
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
  * for mac: needs Mac Developer license - not going to buy that

### Reminder
#### Sources for unread message functions
* Rambox
  * app/store/ServicesList.js
* Franz (single repos for each recipt / service)
  * Example WhatsApp: https://github.com/meetfranz/recipe-whatsapp


### links
#### general
* Download Stats
  * GitHub Release Stats: https://www.somsubhra.com/github-release-stats/?username=yafp&repository=ttth

#### for electron beginners
* General
  * Electron documentation: https://electronjs.org/docs
  * Project boilerplate: https://github.com/szwacz/electron-boilerplate
  * Example electron project: https://github.com/electron/electron-quick-start
  * Main vs Renderer Process: https://github.com/electron/electron/blob/master/docs/tutorial/application-architecture.md#main-and-renderer-processes
* Building
  * Building: https://medium.com/how-to-electron/a-complete-guide-to-packaging-your-electron-app-1bdc717d739f
  * Linux building configuration: https://www.electron.build/configuration/linux
  * Building for Windows on Linux: https://blog.aaronlenoir.com/2017/03/03/building-electron-apps-for-windows-on-debian/
* Misc
  * Keyboard Shortcuts: https://electronjs.org/docs/api/accelerator
  * package.json validator: http://package-json-validator.com/
  * Handling npm packages https://bytearcher.com/articles/using-npm-update-and-npm-outdated-to-update-dependencies/
