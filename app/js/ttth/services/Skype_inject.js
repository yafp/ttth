const {ipcRenderer} = require("electron");


/**
* @name serviceSkypeGetUnreadMessageCount
* @summary Gets the amount of unread messages of the service Skype
* @description Gets the amount of unread messages of the service Skype
*/
function serviceSkypeGetUnreadMessageCount()
{
    console.log("serviceSkypeGetUnreadMessageCount ::: Checking unread message count");

    let count = 0;
    const container = document.querySelector('[role="tablist"] > [title="Chats"] > div');
    if (container) 
    {
        const children = container.children;

        if (children.length === 3) 
        {
            const elementContainer = children[children.length - 1];
            if (elementContainer) 
            {
                const element = elementContainer.querySelector('[data-text-as-pseudo-element]');
                count = parseInt(element.dataset.textAsPseudoElement, 10);
            }
        }
    }

    console.log("serviceSkypeGetUnreadMessageCount ::: Total Skype chats with unread messages: " + count);

    // send back from webview to main
    ipcRenderer.sendToHost(counter);
}


ipcRenderer.on("request", function()
{
    ipcRenderer.sendToHost(serviceSkypeGetUnreadMessageCount());
});
