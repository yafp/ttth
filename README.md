![GitHub License](https://img.shields.io/github/license/yafp/ttth.svg)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/64a82c2d156f41c1b75431fb6da1c693)](https://www.codacy.com/app/yafp/ttth?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=yafp/ttth&amp;utm_campaign=Badge_Grade)
[![AppVeyor Build status](https://ci.appveyor.com/api/projects/status/rd107p8kbexiot08?svg=true)](https://ci.appveyor.com/project/yafp/ttth)
[![Build Status](https://travis-ci.org/yafp/ttth.svg?branch=master)](https://travis-ci.org/yafp/ttth)
![GitHub Current Release](https://img.shields.io/github/release/yafp/ttth.svg?style=flat)
![GitHub Release Date](https://img.shields.io/github/release-date/yafp/ttth.svg?style=flat)
![GitHub All Releases](https://img.shields.io/github/downloads/yafp/ttth/total.svg)
![GitHub Last Commit](https://img.shields.io/github/last-commit/yafp/ttth.svg?style=flat)
![GutHub Languages](https://img.shields.io/github/languages/count/yafp/ttth.svg?style=flat)
![GitHub Repo Size](https://img.shields.io/github/repo-size/yafp/ttth.svg?style=flat)
![GitHub Code Size](https://img.shields.io/github/languages/code-size/yafp/ttth.svg?style=flat)
![GitHub Issues Closed](https://img.shields.io/github/issues-closed-raw/yafp/ttth.svg?style=flat)
![GitHub Issues Open](https://img.shields.io/github/issues-raw/yafp/ttth.svg?style=flat)


![logo](https://raw.githubusercontent.com/yafp/ttth/master/.github/logo/128x128.png)

# ttth

## table of contents

- [about](#about)
- [ui](#ui)
- [services](#services)
- [changelog](#changelog)
- [download](#download)
- [install](#install)
- [keyboard-shortcuts](#keyboard-shortcuts)
- [faq](#faq)
- [contributing](#contributing)

## about
**ttth** (talk to the hand) is an electron based desktop app for online services like WhatsApp, Threema, Telegram, Google and several others.

It is:

* inspired by apps like [Franz](https://github.com/meetfranz/franz) and [Rambox](https://github.com/ramboxapp/community-edition).
* available for ![linux](https://raw.githubusercontent.com/yafp/ttth/master/.github/platform/linux_16x16.png) linux, ![apple](https://raw.githubusercontent.com/yafp/ttth/master/.github/platform/apple_16x16.png) macOS and ![windows](https://raw.githubusercontent.com/yafp/ttth/master/.github/platform/windows_16x16.png) windows.

## ui
![logo](https://raw.githubusercontent.com/yafp/ttth/master/.github/screenshots/ui_latest.png)


## services
* Freenode
* GitHub
* Google Calendar
* Google Contacts
* Google Keep
* Google Mail <sub><sup>(1)<sub><sup>
* Google Messages <sub><sup>(1, 2)<sub><sup>
* Google Photos
* Mattermost <sub><sup>(1)<sub><sup>
* Slack <sub><sup>(1, 2)<sub><sup>
* Telegram <sub><sup>(1)<sub><sup>
* Threema <sub><sup>(1, 2)<sub><sup>
* Twitter
* WhatsApp <sub><sup>(1)<sub><sup>
* Xing <sub><sup>(2)<sub><sup>


<sub><sup>
**Legend:**  
1 = featuring basic unread messages badge;  
2 = experimental
</sup></sub>


## changelog
Please see the [changlog](CHANGELOG.md) for more details.


## download
Download the latest release from [here](https://github.com/yafp/ttth/releases).


## install

### linux

#### .deb
* Download the latest .deb
* execute: ```sudo dpkg -i /path/to/local/ttth-file.deb```

#### AppImage
* Download the latest .AppImage
* Copy the AppImage to the desired location
* Make it executable: ```chmod +x /path/to/local/ttth-file.AppImage```
* Execute it

#### Snap
* Download the latest .snap
* execute: ```sudo snap install /path/to/local/ttth-file.snap```

### macOS
#### dmg
* Download the latest .dmg
* Mount the .dmg
* Drag the .app to /Applications

#### zip
* Download the latest .zip
* Extract the zip
* Drag the .app to /Applications

### windows

#### installer
* Download the latest *win-installer.exe
* Execute the *win-installer.exe


## keyboard-shortcuts

| Function                        | Linux     | macOS     | Windows   |
| ------------------------------- | --------- | --------- | ----------
| Homepage                        | F1        | F1        | F1        |
| Report issue                    | F2        | F2        | F2        |
| Toggle menubar                  | F10       | -         | F10       |
| Toggle Fullscreen mode          | F11       | F11       | F11       |
| Toggle developer console        | F12       | F12       | F12       |
| Show Settings                   | CTRL + ,  | CMD + ,   | CTRL + ,  |
| Jump to next tab                | CTRL + N  | CMD + N   | CTRL + N  |
| Reload current service          | CTRL + S  | CMD + S   | CTRL + S  |
| Quit/exit the application       | CTRL + Q  | CMD + Q   | CTRL + Q  |
| Reload the application          | CTRL + R  | CMD + R   | CTRL + R  |
| Minimize window                 | CTRL + H  | CMD + H   | CTRL + H  |
| Maximize window                 | CTRL + M  | CMD + M   | CTRL + M  |


## faq
### Where is the user data stored?
#### Linux
Please check ```~/.config/ttth/```
#### macOS
Please check ```~/Library/Application Support/ttth/```
#### Windows
Please check ```%APPDATA%\ttth```

### How is the autostart information stored?
#### Linux
Using a .desktop entry in ```~/.config/autostart/```
#### macOS
Using a .plist file in  ```~/Library/LaunchAgents/``` to create a Launch Agent
#### Windows
Using a registry entry in ```\HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run```


## contributing
Please see the [contributing informations](CONTRIBUTING.md) for more details.
