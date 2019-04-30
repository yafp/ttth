const {remote} = require("electron"); //Imports the remote module to use session inside webview
const { session } = require('electron');
var ses = remote.session.defaultSession; //Gets the default session
//ses.clearCache();
ses.flushStorageData();
ses.clearStorageData({ //Clears the specified storages in the session
    storages: ['appcache', 'serviceworkers', 'cachestorage', 'websql', 'indexdb'],
});

window.navigator.serviceWorker.getRegistrations().then(registrations => {
    for (let registration of registrations) {
        registration.unregister(); //Unregisters all the service workers
    }
});



// via: https://github.com/meetfranz/franz/issues/1185

/*
const {remote} = electron; //Imports the remote module to use session inside webview
var ses = remote.session.defaultSession; //Gets the default session


ses.flushStorageData(); //Writes any unwritten DOMStorage data to disk
ses.clearStorageData({ //Clears the specified storages in the session
    storages: ['appcache', 'serviceworkers', 'cachestorage', 'websql', 'indexdb'],
});


window.navigator.serviceWorker.getRegistrations().then(registrations => {
    for (let registration of registrations) {
        registration.unregister(); //Unregisters all the service workers
    }
});
const titleEl = document.querySelector('.window-title');
if (titleEl && titleEl.innerHTML.includes('Google Chrome 36+')) {
    window.location.reload(); //Reloads the page if the page shows the error
}
*/

//alert("post init.js");
