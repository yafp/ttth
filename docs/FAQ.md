![logo](https://raw.githubusercontent.com/yafp/ttth/master/.github/images/logo/128x128.png)

# ttth

## faq

*** 

### Where is the user data stored?
#### Linux
Please check ```~/.config/ttth/```
#### macOS
Please check ```~/Library/Application Support/ttth/```
#### Windows
Please check ```%APPDATA%\ttth```

***

### Where is the ttth log file?
#### linux
Please check ```~/.config/ttth/log.log```
#### macOS
Please check ```~/Library/Logs/ttth/log.log```
Consider using ```/Applications/Utilities/Console.app``` to access read the log.
#### Windows
Please check ```%USERPROFILE%\AppData\Roaming\ttth\log.log```

*** 

### Where is the window position and size stored?
#### linux
Please check ```~/.config/ttth/ttthMainWindowPosSize.json```
#### macOS
Please check ```~/Library/Logs/ttth/ttthMainWindowPosSize.json```
#### Windows
Please check ```%USERPROFILE%\AppData\Roaming\ttth\ttthMainWindowPosSize.json```

***

### How is the autostart information stored?
#### Linux
Using a .desktop entry in ```~/.config/autostart/```
#### macOS
Using a .plist file in  ```~/Library/LaunchAgents/``` to create a Launch Agent
#### Windows
Using a registry entry in ```\HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run```

***

### What is urgent window mode?
With urgent window mode enabled the app tries to inform the user about unread messages.
That means: If a configured and enabled service has an unread message count > 0 and ttth is not in foreground/focus the window or its dock icon will flash to inform the user.

***

### Is there a lock function?
No, ttth does not offer a setting or option to lock the application. If you really need to prevent access to the application while you are away from keyboard, lock your operating system.
See [#130](https://github.com/yafp/ttth/issues/130)

***
