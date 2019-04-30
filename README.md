![GitHub](https://img.shields.io/github/license/yafp/ttth.svg)

# ttth
## about


## ui
![logo](https://raw.githubusercontent.com/yafp/ttth/master/.github/ui_latest.png)

## changelog
Please see the [changlog](CHANGELOG.md) for more details.



## install
### linux

#### .deb
* Download the latest .deb
* execute: ```sudo dpkg -i /path/to/local/logre-file.deb```

#### AppImage
* Copy the AppImage to the desired location
* Make it executable: ```chmod +x /path/to/local/logre-file.AppImage```
* Execute it

#### Snap
* execute: ```sudo snap install /path/to/local/logre-file.snap```


## howto
#### getting started as developer
* Clone the repository: ```git clone https://github.com/yafp/logre```
* Go into the repository: ```cd logre```
* Install dependencies: ```npm install```
* Run logre: ```npm start```

### Add electron-builder to devDependencies
* Navigate to repository
* Execute: ```npm install electron-builder --save-dev```

### create builds from cli
* Navigate to repository
* Execute: ```npm run dist```

### jsdoc
* Navigate to repository
* Execute: ```jsdoc --configure jsdoc.json --readme README.md```

## links
### for electron beginners
* Example electron project: https://github.com/electron/electron-quick-start
* package.json validator: http://package-json-validator.com/
* Project boilerplate: https://github.com/szwacz/electron-boilerplate
* Building: https://medium.com/how-to-electron/a-complete-guide-to-packaging-your-electron-app-1bdc717d739f
* Linux building configuration: https://www.electron.build/configuration/linux


## faq
### Where is the data stored?
Please check ```~/.config/ttth/```
