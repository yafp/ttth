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
- [known-issues](#known-issues)
- [contributing](#contributing)

## about
**ttth** (talk to the hand) is an electron based desktop app for online services like WhatsApp, Threema, Telegram, Google and several others.

It is:

* inspired by apps like [Franz](https://github.com/meetfranz/franz) and [Rambox](https://github.com/ramboxapp/community-edition).
* available for ![linux](https://raw.githubusercontent.com/yafp/ttth/master/.github/platform/linux_16x16.png) linux, ![apple](https://raw.githubusercontent.com/yafp/ttth/master/.github/platform/apple_16x16.png) macOS and ![windows](https://raw.githubusercontent.com/yafp/ttth/master/.github/platform/windows_16x16.png) windows.

## ui
![logo](https://raw.githubusercontent.com/yafp/ttth/master/.github/screenshots/ui_latest.png)


## services
* Discord
* Dropbox
* Freenode
* GitHub
* Google Calendar
* Google Contacts
* Google Drive
* Google Keep
* Google Mail
* Google Messages
* Google Photos
* LinkedIn
* Mattermost
* Messenger
* Nextcloud
* Slack
* Telegram
* Threema
* Twitter
* WhatsApp
* Xing


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

| Function                        | Linux                           | macOS                           | Windows                         |
| ------------------------------- | ------------------------------- | ------------------------------- | ------------------------------- |
| Homepage                        | <kbd>F1</kbd>                   | <kbd>F1</kbd>                   | <kbd>F1</kbd>                   |
| Report issue                    | <kbd>F2</kbd>                   | <kbd>F2</kbd>                   | <kbd>F2</kbd>                   |
| Toggle menubar                  | <kbd>F10</kbd>                  | -                               | <kbd>F10</kbd>                  |
| Toggle Fullscreen mode          | <kbd>F11</kbd>                  | <kbd>F11</kbd>                  | <kbd>F11</kbd>                  |
| Toggle developer console        | <kbd>F12</kbd>                  | <kbd>F12</kbd>                  | <kbd>F12</kbd>                  |
| Show Settings                   | <kbd>CTRL</kbd> + <kbd>,</kbd>  | <kbd>CMD</kbd> + <kbd>,</kbd>   | <kbd>CTRL</kbd> + <kbd>,</kbd>  |
| Jump to next service            | <kbd>CTRL</kbd> + <kbd>🡆</kbd> | <kbd>CMD</kbd> + <kbd>🡆</kbd>   | <kbd>CTRL</kbd> + <kbd>🡆</kbd>  |
| Jump to previous service        | <kbd>CTRL</kbd> + <kbd>🡄</kbd> | <kbd>CMD</kbd> + <kbd>🡄</kbd>   | <kbd>CTRL</kbd> + <kbd>🡄</kbd>  |
| Jump to service tab 1           | <kbd>CTRL</kbd> + <kbd>1</kbd>  | <kbd>CMD</kbd> + <kbd>1</kbd>   | <kbd>CTRL</kbd> + <kbd>1</kbd>  |
| Jump to service tab 2           | <kbd>CTRL</kbd> + <kbd>2</kbd>  | <kbd>CMD</kbd> + <kbd>2</kbd>   | <kbd>CTRL</kbd> + <kbd>2</kbd>  |
| Jump to service tab 3           | <kbd>CTRL</kbd> + <kbd>3</kbd>  | <kbd>CMD</kbd> + <kbd>3</kbd>   | <kbd>CTRL</kbd> + <kbd>3</kbd>  |
| Jump to service tab ...         | <kbd>CTRL</kbd> + <kbd>...</kbd>  | <kbd>CMD</kbd> + <kbd>...</kbd>   | <kbd>CTRL</kbd> + <kbd>...</kbd>  |
| Reload current service          | <kbd>CTRL</kbd> + <kbd>S</kbd>  | <kbd>CMD</kbd> + <kbd>S</kbd>   | <kbd>CTRL</kbd> + <kbd>S</kbd>  |
| Quit/exit the application       | <kbd>CTRL</kbd> + <kbd>Q</kbd>  | <kbd>CMD</kbd> + <kbd>Q</kbd>   | <kbd>CTRL</kbd> + <kbd>Q</kbd>  |
| Reload the application          | <kbd>CTRL</kbd> + <kbd>R</kbd>  | <kbd>CMD</kbd> + <kbd>R</kbd>   | <kbd>CTRL</kbd> + <kbd>R</kbd>  |
| Minimize window                 | <kbd>CTRL</kbd> + <kbd>M</kbd>  | <kbd>CMD</kbd> + <kbd>M</kbd>   | <kbd>CTRL</kbd> + <kbd>M</kbd>  |
| Maximize window                 | <kbd>CTRL</kbd> + <kbd>K</kbd>  | <kbd>CMD</kbd> + <kbd>K</kbd>   | <kbd>CTRL</kbd> + <kbd>K</kbd>  |
| Hide window                     | <kbd>CTRL</kbd> + <kbd>H</kbd>  | <kbd>CMD</kbd> + <kbd>H</kbd>   | <kbd>CTRL</kbd> + <kbd>H</kbd>  |


## faq

### Where is the user data stored?
#### Linux
Please check ```~/.config/ttth/```
#### macOS
Please check ```~/Library/Application Support/ttth/```
#### Windows
Please check ```%APPDATA%\ttth```

### Where is the ttth log file
#### linux
Please check ```~/.config/ttth/log.log```
#### macOS
Please check ```~/Library/Logs/ttth/log.log```
#### Windows
Please check ```%USERPROFILE%\AppData\Roaming\ttth\log.log```

### How is the autostart information stored?
#### Linux
Using a .desktop entry in ```~/.config/autostart/```
#### macOS
Using a .plist file in  ```~/Library/LaunchAgents/``` to create a Launch Agent
#### Windows
Using a registry entry in ```\HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run```


## known-issues
### general
#### Function: Hide
Hide should hide the current window. It is re-accessable afterwards via the Tray icon, but most likely not by any other method. (<kbd>ALT</kbd>+<kbd>TAB</kbd>) to unhide it won't work so far.
### macOS
#### Function Toggle Fullscreen
<kbd>F11</kbd> should toggle the fullscreen-mode, but macOS seems to use <kbd>F11</kbd> system-wide for "Show Desktop".
As a result toggle fullscreen-mode on macOS only works by manually selecting it via the menu.


## contributing
Please see the [contributing informations](CONTRIBUTING.md) for more details.
