// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

console.log("renderer.js ::: Dummy");



// Do this from the renderer process
var notif = new window.Notification('Download Complete', {
  body: torrent.name,
  silent: true // We'll play our own sound
})

// If the user clicks in the Notifications Center, show the app
notif.onclick = function () {
  ipcRenderer.send('focusWindow', 'main')
}

// Play a sound using the standard HTML5 Audio API
sound.play('DONE')


console.log("renderer.js ::: Dummy");
