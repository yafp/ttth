![logo](https://raw.githubusercontent.com/yafp/ttth/master/.github/logo/128x128.png)

# ttth
## notes

### ideas  and brainstorming
* Services
  * Google Duo (video -> webcam)?
* Updater
  * official way for win & macos: https://electronjs.org/docs/tutorial/updates
  * 'nuts' for pushing out updates to electron applications. Based on Github Releases
  * 'electron-release-server'
  * 'squirrel-updates-server'
  * 'auto-updater'
  * 'Electron-gh-releases'
  * https://github.com/megahertz/electron-simple-updater/ (looks promising)
* Code-Sign: for windows and macOS - required for auto-updates: https://electronjs.org/docs/tutorial/code-signing
  * for mac: needs Mac Developer license - not going to buy that

* Improve CrashReporter: 
** check Sentry: 
*** https://sentry.io/
*** https://docs.sentry.io/platforms/javascript/electron/
*** src: https://blog.sentry.io/2018/11/06/minidumps-electron-bug-reports


### Reminder
#### Sources for unread message functions
* Rambox
  * app/store/ServicesList.js
* Franz (single repos for each recipt / service)
  * Example WhatsApp: https://github.com/meetfranz/recipe-whatsapp

#### How to open developer console for single webview/service
* Open the DevTools for ttth
* Navigate to the Elements tab
* Select/highlight the service webview you want to debug
* Hit ESC 
* Then type: $0.openDevTools()



### links
* Download Stats
  * GitHub Release Stats: https://www.somsubhra.com/github-release-stats/?username=yafp&repository=ttth
