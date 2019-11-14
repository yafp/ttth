const {ipcRenderer} = require("electron");


/**
* @name serviceRiotGetUnreadMessageCount
* @summary Gets the amount of unread messages of the service Riot.im
* @description Gets the amount of unread messages of the service Riot.im
*/
function serviceRiotGetUnreadMessageCount()
{
    console.log("serviceRiotGetUnreadMessageCount ::: Checking unread message count");

    var i;
    var ii;

    var a=document.getElementsByClassName("mx_RoomTile_nameContainer"),b=0;
    for(i=0;i<a.length;i++)
    {
        var c=a[i].getElementsByClassName("mx_RoomTile_badge");
        for(ii=0;ii<c.length;ii++)
        {
            parseInt(c[ii].textContent.trim())%1===0&&(b+=parseInt(c[ii].textContent.trim()));
        }
    }

    console.log("serviceRiotGetUnreadMessageCount ::: Unread messages in Riot: _" + b + "_.");


    ipcRenderer.sendToHost(b.toString()); // We need to convert the result to string - since moving to electron 6.x
    return b.toString(); // needed, since electron 6.x. Otherwise (without return) the service crashes.
}

ipcRenderer.on("request", function()
{
    ipcRenderer.sendToHost(serviceRiotGetUnreadMessageCount());
});
