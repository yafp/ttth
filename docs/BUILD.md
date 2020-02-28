![logo](https://raw.githubusercontent.com/yafp/ttth/master/.github/images/logo/128x128.png)

# ttth
## Build
Be aware that you can build windows releases directly on linux (using Wine) if you want to.
For more details check [here](https://blog.aaronlenoir.com/2017/03/03/building-electron-apps-for-windows-on-debian/).

### Pre
```
# Cleaning up node_modules
npm run reinstall

# Updating jsdoc files
npm run jsdocs-update

# Check synthax of .js files
npm run standardx
```

### Packaging
```
# linux
npm run pack-linux

# mac
npm run pack-mac

# windows
npm run pack-win
```

### Building

```
# linux
npm run build-linux

# mac
npm run build-mac

# windows
npm run build-win
```
