![logo](https://raw.githubusercontent.com/yafp/ttth/master/.github/logo/128x128.png)

# Contributing

When contributing to this repository, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change.



## howto

### 1. First steps (Getting started as developer)

#### Clone repo
* Clone the repository: ```git clone https://github.com/yafp/ttth```

#### Install dependencies
* Go into the repository: ```cd ttth```
* Install dependencies: ```npm install```

#### Run the code
* Run ttth: ```npm start```

#### Run the code with debug logging
* Run ttth: ```npm run start-debug```

#### Run some basic test
* Execute: ```npm test```




### 2. Adding functions

#### adding a new service
* Edit ```app/js/ttth/services.json``` and add the new service




### 3. Creating a new build

#### Generate jsdoc files
* Navigate to repository
* Execute: ```jsdoc --configure jsdoc.json --readme README.md```


#### Packaging
* Navigate to repository

##### linux
* Execute: ```npm run pack-linux```

##### mac
* Execute: ```npm run pack-mac```

##### windows
* Execute: ```npm run pack-win```



#### Building
* Navigate to repository

##### linux
* Execute: ```npm run build-linux```

##### mac
* Execute: ```npm run build-mac```

##### windows
* Execute: ```npm run build-win```



### 4. Misc
#### Install electron
* Navigate to repository
* Execute: ```npm install --save-dev electron```

#### Install electron packager
* Navigate to repository
* Execute: ```npm install electron-packager --save-dev```

#### Add electron-builder to devDependencies
* Navigate to repository
* Execute: ```npm install electron-builder --save-dev```

#### check for outdated npm packages
* ```npm outdated```

#### npm update packages
* ```npm update```

#### npm update single package
* ```npm install PACKAGENAME --save```

#### npm: install single package in specific version
* ```npm install PACKAGENAME@1.2.3```



### CI
The project repository is using:

* [Travis CI](https://travis-ci.org/) (for Linux and macOS)
* [AppVeyor](https://ci.appveyor.com/project/yafp/ttth) (for Windows)

for Continuos Integration aspects.
