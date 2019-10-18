![logo](https://raw.githubusercontent.com/yafp/ttth/master/.github/logo/128x128.png)

# ttth
## notes

### ideas / brainstorming
* Services
  * ?
* Updater (seems like a major cluster-fuck, at least if you are looking for 1 solution which works for all 3 platforms)
  * official way for win & macos: https://electronjs.org/docs/tutorial/updates
  * 'nuts' for pushing out updates to electron applications. Based on Github Releases
  * 'electron-release-server'
  * 'squirrel-updates-server'
  * 'auto-updater'
  * 'Electron-gh-releases'
  * https://github.com/megahertz/electron-simple-updater/ (looks promising)
  *  Mayjor bugger: Code-Sign: for windows and macOS - required for auto-updates: https://electronjs.org/docs/tutorial/code-signing
    * for mac: needs Mac Developer license - not going to buy that
* via sceptiq: split-view (show multiple services at once). In other words a "fav-tab" which shows a selected amount of services at once.
* Online/Offline Events: https://electronjs.org/docs/tutorial/online-offline-events

### Reminder
#### Sources for unread message functions
* Rambox
  * app/store/ServicesList.js
* Franz (single repos for each recipt / service)
  * Example Franz/WhatsApp: https://github.com/meetfranz/recipe-whatsapp

### links
* Download Stats
  * GitHub Release Stats: https://www.somsubhra.com/github-release-stats/?username=yafp&repository=ttth
