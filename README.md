![GitHub](https://img.shields.io/github/license/yafp/ttth.svg)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/64a82c2d156f41c1b75431fb6da1c693)](https://www.codacy.com/app/yafp/ttth?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=yafp/ttth&amp;utm_campaign=Badge_Grade)
![](https://img.shields.io/github/languages/count/yafp/ttth.svg?style=flat)
![](https://img.shields.io/github/repo-size/yafp/ttth.svg?style=flat)
![](https://img.shields.io/github/languages/code-size/yafp/ttth.svg?style=flat)
![](https://img.shields.io/github/release/yafp/ttth.svg?style=flat)
![](https://img.shields.io/github/release-date/yafp/ttth.svg?style=flat)
![](https://img.shields.io/github/last-commit/yafp/ttth.svg?style=flat)
![](https://img.shields.io/github/issues-closed-raw/yafp/ttth.svg?style=flat)
![](https://img.shields.io/github/issues-raw/yafp/ttth.svg?style=flat)


![logo](https://raw.githubusercontent.com/yafp/ttth/master/.github/logo_128x128.png)

# ttth
## about
**ttth** (talk to the hand) is an electron based desktop app for online services like WhatsApp-Web, Threema-Web, Telegram-Web, Google and several other services.

## services
* Freenode
* GitHub
* Google Calendar
* Google Contacts
* Google Keep
* Google Mail <sub><sup>(1)<sub><sup>
* Google Messages
* Google Photos
* Mattermost <sub><sup>(2)<sub><sup>
* Slack <sub><sup>(1, 2)<sub><sup>
* Telegram <sub><sup>(1)<sub><sup>
* Threema <sub><sup>(1, 2)<sub><sup>
* Twitter
* WhatsApp <sub><sup>(1)<sub><sup>


<sub><sup>
**Legend:**  
1 = featuring basic unread messages badge;  
2 = experimental
</sup></sub>

## ui
![logo](https://raw.githubusercontent.com/yafp/ttth/master/.github/screenshot/ui_latest.png)


## install
Download the latest release from [here](https://github.com/yafp/ttth/releases).

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


### windows

#### portable
* missing

#### installer
* missing

#### zip
* missing


## changelog
Please see the [changlog](CHANGELOG.md) for more details.


## getting involved
Please see the [developers informations](DEVELOPMENT.md) for more details.


## faq
### Where is the user data stored?
#### Linux
Please check ```~/.config/ttth/```
#### Windows
Please check ```%APPDATA%\ttth```

### How is the autostart information stored?
#### Linux
Using a .desktop entry in ```~/.config/autostart/```
#### Windows
Using a registry entry in ```\HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run```
