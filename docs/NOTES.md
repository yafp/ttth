![logo](https://raw.githubusercontent.com/yafp/ttth/master/.github/logo/128x128.png)

# ttth
## notes

### ideas / brainstorming
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
* Check "electron-dl" for downloading new releases (https://github.com/sindresorhus/electron-dl)
  * The electron-dl package is an A+ integration of the standard native OS download interaction that could be missed with a non-native application. 
  * It automatically saves downloaded files in the user’s downloads directory, 
  * shows download progress on the application icon, 
  * and (on macOS) bounces the Downloads directory in the dock when complete.
* Automatic contributors handling: https://allcontributors.org/docs/en/bot/configuration

### Reminder
#### Sources for unread message functions
* Rambox: app/store/ServicesList.js
* Hamsket:
* Franz (is using single repos for each service). Example: https://github.com/meetfranz/recipe-whatsapp
* Ferdi:

### links
* Download Stats
  * GitHub Release Stats: https://www.somsubhra.com/github-release-stats/?username=yafp&repository=ttth
