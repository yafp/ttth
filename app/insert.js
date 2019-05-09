document.addEventListener("DOMContentLoaded", function(event) 
{
    console.error("insert.js ::: DOMContentLoaded");

    // Try to find unread whatsapp messages 
    //
    const elements = document.querySelectorAll(".CxUIE, .unread");
    console.error(elements);
    let count = 0;

    for (let i = 0; i < elements.length; i++)
    {
        //alert("qqqq");
        if (elements[i].querySelectorAll('*[data-icon="muted"]').length === 0)
        {
            count += 1;
            console.log("insert.js ::: Found unread message");
        }
    }
    console.error("insert.js ::: Finished searching for unread messages");

    //alert("insert:js ::: Count: " + count);
    //alert("insert.js ::: DOMContentLoaded");

});


alert("insert.js ::: insert done");
