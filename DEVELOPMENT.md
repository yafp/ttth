# ttth
## about
This document contains informations for ttth developers

## howto

### Firste steps

#### getting started as developer
* Clone the repository: ```git clone https://github.com/yafp/ttth```
* Go into the repository: ```cd ttth```
* Install dependencies: ```npm install```
* Run logre: ```npm start```

#### Install electron
* Navigate to repository
* Execute: ```npm install --save-dev electron```

#### Install electron packager
* Navigate to repository
* Execute: ```npm install electron-packager --save-dev```

#### Add electron-builder to devDependencies
* Navigate to repository
* Execute: ```npm install electron-builder --save-dev```

#### debug logging
* Go into the repository: ```cd ttth```
* Install dependencies: ```npm install```
* Run logre: ```npm run start-debug```



### Adding functions

#### adding a new service
* Edit ```app/js/ttth/services.js``` and add the name and url of the new service to the related arrays.
* Edit ```app/index.html``` and add the new service as
  * ```nav-item```
  * ```tab-pane```



### Preparing builds

#### Generate jsdoc files
* Navigate to repository
* Execute: ```jsdoc --configure jsdoc.json --readme README.md```



### Creating builds

#### pack using electron-packager (output: dist/)
* Navigate to repository

##### linux
* Execute: ```npm run package-linux-64```

##### mac
* Execute: ```npm run package-mac```

##### windows
* Execute: ```npm run package-win-32```
* Execute: ```npm run package-win-64```


#### build (output: dist/)
* Navigate to repository

##### Linux
* Execute: ```npm run build-linux```

##### Windows
* Execute: ```npm run build-win```




## links
### for electron beginners
* Electron documentation: https://electronjs.org/docs
* Example electron project: https://github.com/electron/electron-quick-start
* package.json validator: http://package-json-validator.com/
* Project boilerplate: https://github.com/szwacz/electron-boilerplate
* Building: https://medium.com/how-to-electron/a-complete-guide-to-packaging-your-electron-app-1bdc717d739f
* Linux building configuration: https://www.electron.build/configuration/linux
* Building for Windows on Linux: https://blog.aaronlenoir.com/2017/03/03/building-electron-apps-for-windows-on-debian/
* App icons: https://www.christianengvall.se/electron-app-icons/
* https://blog.dcpos.ch/how-to-make-your-electron-app-sexy
* Store user data: https://medium.com/cameron-nokes/how-to-store-user-data-in-electron-3ba6bf66bc1e
* Send and retrieve informations from webview: https://ourcodeworld.com/articles/read/201/how-to-send-retrieve-information-and-manipulate-the-dom-from-a-webview-with-electron-framework
* https://github.com/hokein/electron-sample-apps
* Localization: https://www.christianengvall.se/electron-localization/
