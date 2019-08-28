![logo](https://raw.githubusercontent.com/yafp/ttth/master/.github/logo/128x128.png)

# ttth
## known-issues

### general
#### Function: Hide
Hide should hide the current window. It is re-accessable afterwards via the Tray icon, but most likely not by any other method. (<kbd>ALT</kbd>+<kbd>TAB</kbd>) to unhide it won't work so far.

### linux specific
#### Menubar visibilty vs fullscreen-mode
See #94

#### Notification not shown
ttth needs libnotify to display notifications. This means libnotify must be installed and a notification daemon must be setup.
See #99

### macOS specific
#### Function Toggle Fullscreen
<kbd>F11</kbd> should toggle the fullscreen-mode, but macOS seems to use <kbd>F11</kbd> system-wide for "Show Desktop".
As a result toggle fullscreen-mode on macOS only works by manually selecting it via the menu.
