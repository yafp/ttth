# Contributing

When contributing to this repository, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change.



## howto

### First steps

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

#### using devtron
* Open Developer Tools
* Enter: ```require('devtron').install()```


#### run test
* Go into the repository: ```cd ttth```
* Execute: ```npm test```


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

#### pack (using electron-packager)
* Navigate to repository

##### linux
* Execute: ```npm run package-linux-64```

##### mac
* Execute: ```npm run package-mac```

##### windows
* Execute: ```npm run package-win-32```
* Execute: ```npm run package-win-64```


#### build
* Navigate to repository

##### Linux
* Execute: ```npm run build-linux```

##### mac
* Execute: ```npm run build-mac```

##### Windows
* Execute: ```npm run build-win```


### CI
The project repository is using:

* Travis CI (for Linux and macOS)
* AppVeyor (for Windows)

for Continuos Integration aspects.


## links
### for electron beginners
* General
  * Electron documentation: https://electronjs.org/docs
  * Project boilerplate: https://github.com/szwacz/electron-boilerplate
  * Example electron project: https://github.com/electron/electron-quick-start
* Building
  * Building: https://medium.com/how-to-electron/a-complete-guide-to-packaging-your-electron-app-1bdc717d739f
  * Linux building configuration: https://www.electron.build/configuration/linux
  * Building for Windows on Linux: https://blog.aaronlenoir.com/2017/03/03/building-electron-apps-for-windows-on-debian/
  * GitHub Release Stats: https://www.somsubhra.com/github-release-stats/?username=yafp&repository=ttth
* Misc
  * App icons: https://www.christianengvall.se/electron-app-icons/
  * https://blog.dcpos.ch/how-to-make-your-electron-app-sexy
  * Store user data: https://medium.com/cameron-nokes/how-to-store-user-data-in-electron-3ba6bf66bc1e
  * Send and retrieve informations from webview: https://ourcodeworld.com/articles/read/201/how-to-send-retrieve-information-and-manipulate-the-dom-from-a-webview-with-electron-framework
  * Other electron apps: https://github.com/hokein/electron-sample-apps
  * Localization: https://www.christianengvall.se/electron-localization/
  * Keyboard Shortcuts: https://electronjs.org/docs/api/accelerator
  * package.json validator: http://package-json-validator.com/
