![logo](https://raw.githubusercontent.com/yafp/ttth/master/.github/logo/128x128.png)

# ttth

## faq

### Where is the user data stored?
#### Linux
Please check ```~/.config/ttth/```
#### macOS
Please check ```~/Library/Application Support/ttth/```
#### Windows
Please check ```%APPDATA%\ttth```

### Where is the ttth log file?
#### linux
Please check ```~/.config/ttth/log.log```
#### macOS
Please check ```~/Library/Logs/ttth/log.log```
Consider using ```/Applications/Utilities/Console.app``` to access read the log.
#### Windows
Please check ```%USERPROFILE%\AppData\Roaming\ttth\log.log```

### Where is the window position and size stored?
#### linux
Please check ```~/.config/ttth/ttthMainWindowPosSize.json```
#### macOS
Please check ```~/Library/Logs/ttth/ttthMainWindowPosSize.json```
#### Windows
Please check ```%USERPROFILE%\AppData\Roaming\ttth\ttthMainWindowPosSize.json```

### How is the autostart information stored?
#### Linux
Using a .desktop entry in ```~/.config/autostart/```
#### macOS
Using a .plist file in  ```~/Library/LaunchAgents/``` to create a Launch Agent
#### Windows
Using a registry entry in ```\HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run```
