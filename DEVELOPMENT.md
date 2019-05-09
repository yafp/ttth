# ttth
## about
This document contains informations for ttth developers

## howto
### adding a new service
* Edit ```app/js/ttth/services.js``` and add the name and url of the new service to the related arrays.
* Edit ```app/index.html``` and add the new service as
  * ```nav-item```
  * ```tab-pane```


### getting started as developer
* Clone the repository: ```git clone https://github.com/yafp/ttth```
* Go into the repository: ```cd ttth```
* Install dependencies: ```npm install```
* Run logre: ```npm start```

### Add electron-builder to devDependencies
* Navigate to repository
* Execute: ```npm install electron-builder --save-dev```

### debug logging
* Go into the repository: ```cd ttth```
* Install dependencies: ```npm install```
* Run logre: ```npm run start-debug```

### create builds from cli
* Navigate to repository
#### Linux
* Execute: ```npm run pack-linux```
* Execute: ```npm run build-linux```
#### Windows
* Execute: ```npm run pack-win```
* Execute: ```npm run build-win```
#### mac
* missing

### Generate jsdoc files
* Navigate to repository
* Execute: ```jsdoc --configure jsdoc.json --readme README.md```

## links
### for electron beginners
* Example electron project: https://github.com/electron/electron-quick-start
* package.json validator: http://package-json-validator.com/
* Project boilerplate: https://github.com/szwacz/electron-boilerplate
* Building: https://medium.com/how-to-electron/a-complete-guide-to-packaging-your-electron-app-1bdc717d739f
* Linux building configuration: https://www.electron.build/configuration/linux
* Building for Windows on Linux: https://blog.aaronlenoir.com/2017/03/03/building-electron-apps-for-windows-on-debian/
* App icons: https://www.christianengvall.se/electron-app-icons/
* https://blog.dcpos.ch/how-to-make-your-electron-app-sexy
* Store user data: https://medium.com/cameron-nokes/how-to-store-user-data-in-electron-3ba6bf66bc1e

