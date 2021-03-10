/**
* @file whatsapp_inject.js
* @fileOverview This module contains the inject code for the service whatsapp
* @author yafp
* @namespace services
*/

const { ipcRenderer } = require('electron')

/**
* @function serviceWhatsAppGetUnreadMessageCount
* @summary Gets the amount of unread messages of the service WhatsApp
* @description Gets the amount of unread messages of the service WhatsApp
* @memberof services
*/
function serviceWhatsAppGetUnreadMessageCount () {
    // console.log('serviceWhatsAppGetUnreadMessageCount ::: Checking unread message count')

    // try to count unread messages
    //
    // const elements = document.querySelectorAll(".CxUIE, .unread"); // First version
    // const elements = document.querySelectorAll(".P6z4j, .unread"); // Rambox - currently using
    // const elements = document.querySelectorAll('.CxUIE, .unread, ._0LqQ'); // Franz
    /*
    const elements = document.querySelectorAll("#pane-side .P6z4j, .unread");
    console.log(elements);

    let count = 0;
    for (let i = 0; i < elements.length; i++)
    {
        //if (elements[i].querySelectorAll('*[data-icon="muted"]').length === 0) // ignore muted
        if (elements[i].parentNode.parentNode.querySelectorAll("#pane-side *[data-icon='muted']").length === 0)
        {
            count += 1;
            console.log("serviceWhatsAppGetUnreadMessageCount ::: Found unread message");
        }
        else
        {
            count += 1;
            console.log("serviceWhatsAppGetUnreadMessageCount ::: Ignoring unread message message from muted communication");
        }
    }
    console.log("serviceWhatsAppGetUnreadMessageCount ::: Unread messages in WhatsApp: _" + count + "_.");
    */

    // TEMP NEW

    const elements = document.querySelectorAll('#pane-side .P6z4j, .unread')
    let count = 0
    for (const i of elements) {
        const gp = i.parentNode.parentNode
        gp.querySelectorAll('#pane-side *[data-icon="muted"]').length === 0 && count++
    }

    console.log('serviceWhatsAppGetUnreadMessageCount ::: Final conversation count with unread messages in WhatsApp is: _' + count + '_.')

    ipcRenderer.sendToHost(count.toString()) // We need to convert the result to string - since moving to electron 6.x
    return count.toString() // needed, since electron 6.x. Otherwise (without return) the service crashes.

    /*
    let checkUnread=()=>{const elements=document.querySelectorAll("#pane-side .VOr2j")
    let count=0;
    for(const i of elements)
    {
        const gp=i.parentNode.parentNode;0===gp.querySelectorAll('#pane-side *[data-icon="muted"]').length&&count++
    }
    console.log('serviceWhatsAppGetUnreadMessageCount ::: Final conversation count with unread messages in WhatsApp is: _' + count + '_.')

    ipcRenderer.sendToHost(count.toString()) // We need to convert the result to string - since moving to electron 6.x

    setInterval(checkUnread,1e3);
    let unregister_queue=[];
    navigator.serviceWorker.getRegistrations().then(registrations=>{
        for(const registration of registrations)unregister_queue.push(registration.unregister());
        return unregister_queue
    }).then(queue=>{}).catch(err=>{});

    return count.toString() // needed, since electron 6.x. Otherwise (without return) the service crashes
    */
}

ipcRenderer.on('request', function () {
    ipcRenderer.sendToHost(serviceWhatsAppGetUnreadMessageCount())
})
