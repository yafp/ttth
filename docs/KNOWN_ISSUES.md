![logo](https://raw.githubusercontent.com/yafp/ttth/master/.github/images/logo/128x128.png)

# ttth
## known-issues

### general
#### Menubar function: Hide
Hide should hide the current window. It is re-accessable afterwards via the Tray icon, but most likely not by any other method. (<kbd>ALT</kbd>+<kbd>TAB</kbd>) to unhide it won't work so far.


### platform specific

#### ![linux](https://raw.githubusercontent.com/yafp/ttth/master/.github/images/platform/linux_16x16.png) linux
##### Notification not shown
**ttth** needs ```libnotify``` to display desktop notifications. This means ```libnotify``` must be installed and a notification daemon must be configured.
See [#99](https://github.com/yafp/ttth/issues/99)

#### ![apple](https://raw.githubusercontent.com/yafp/ttth/master/.github/images/platform/apple_16x16.png) macOS
##### Function Toggle Fullscreen
<kbd>F11</kbd> should toggle the fullscreen-mode, but macOS seems to use <kbd>F11</kbd> system-wide for "Show Desktop".
As a result toggle fullscreen-mode on macOS only works by manually selecting it via the menu.

### ![windows](https://raw.githubusercontent.com/yafp/ttth/master/.github/images/platform/windows_16x16.png) windows
nothing so far
