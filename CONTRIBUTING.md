![logo](https://raw.githubusercontent.com/yafp/ttth/master/.github/logo/128x128.png)

# Contributing

When contributing to this repository, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change.



## howto

### First steps

#### getting started as developer
* Clone the repository: ```git clone https://github.com/yafp/ttth```
* Go into the repository: ```cd ttth```
* Install dependencies: ```npm install```
* Run ttth: ```npm start```

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
* Run ttth: ```npm run start-debug```


#### run test
* Go into the repository: ```cd ttth```
* Execute: ```npm test```


### Adding functions

#### adding a new service
* Edit ```app/js/ttth/services.json``` and add the new service


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

* [Travis CI](https://travis-ci.org/) (for Linux and macOS)
* [AppVeyor](https://ci.appveyor.com/project/yafp/ttth) (for Windows)

for Continuos Integration aspects.


## links
### for electron beginners
* General
  * Electron documentation: https://electronjs.org/docs
  * Project boilerplate: https://github.com/szwacz/electron-boilerplate
  * Example electron project: https://github.com/electron/electron-quick-start
  * Main vs Renderer Process: https://github.com/electron/electron/blob/master/docs/tutorial/application-architecture.md#main-and-renderer-processes
* Building
  * Building: https://medium.com/how-to-electron/a-complete-guide-to-packaging-your-electron-app-1bdc717d739f
  * Linux building configuration: https://www.electron.build/configuration/linux
  * Building for Windows on Linux: https://blog.aaronlenoir.com/2017/03/03/building-electron-apps-for-windows-on-debian/
* Download Stats
  * GitHub Release Stats: https://www.somsubhra.com/github-release-stats/?username=yafp&repository=ttth
* Misc
  * Keyboard Shortcuts: https://electronjs.org/docs/api/accelerator
  * package.json validator: http://package-json-validator.com/
