![GitHub](https://img.shields.io/github/license/yafp/ttth.svg)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/64a82c2d156f41c1b75431fb6da1c693)](https://www.codacy.com/app/yafp/ttth?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=yafp/ttth&amp;utm_campaign=Badge_Grade)

# ttth
## about
ttth aka talk-to-the hand is an electron based application which can access certain web-services.

## services
* WhatsApp Web
* Google Calendar
* Google Keep

## ui
![logo](https://raw.githubusercontent.com/yafp/ttth/master/.github/ui_latest.png)

## changelog
Please see the [changlog](CHANGELOG.md) for more details.

## install
### linux

#### .deb
* Download the latest .deb
* execute: ```sudo dpkg -i /path/to/local/ttth-file.deb```

#### AppImage
* Copy the AppImage to the desired location
* Make it executable: ```chmod +x /path/to/local/ttth-file.AppImage```
* Execute it

#### Snap
* execute: ```sudo snap install /path/to/local/ttth-file.snap```


## howto
#### getting started as developer
* Clone the repository: ```git clone https://github.com/yafp/ttth```
* Go into the repository: ```cd ttth```
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
