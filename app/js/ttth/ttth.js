function updateDefaultView()
{
    console.log("updateDefaultView ::: Start");

    // get currently selected value from select
    var newDefaultView = $( "#selectDefaultView" ).val();
    console.log("updateDefaultView ::: New default view on start is set to: " + newDefaultView);

    //$("#selectDefaultView").val(newDefaultView);

    // Store default view in local storage
    writeLocalStorage("defaultView", newDefaultView);

    console.log("updateDefaultView ::: End");
}




function validateConfiguredDefaultView()
{
  // read from local storage
  var curDefaultView = readLocalStorage("defaultView");

  if(curDefaultView === null) // no default view configured
  {
      console.log("validateConfiguredDefaultView ::: No default configured - Stay on settings-view");
  }
  else
  {
    console.log("validateConfiguredDefaultView ::: Found configured default view: " + curDefaultView);

    // check if the configured service is enabled or not
    console.log("validateConfiguredDefaultView ::: Check if configured default view is an enabled service or not");

      var exists = false;

      // Check if Dropdown contains the defined default view as enabled service
      $("#selectDefaultView option").each(function(){
        //console.warn(this.value);
      if (this.value === curDefaultView)
      {
        exists = true;
        return false;
      }
      });

      if(exists)
      {
        console.log("validateConfiguredDefaultView ::: Configured default view is valid");

        // Update select
        $("#selectDefaultView").val(curDefaultView);
      }
      else
      {
          console.log("validateConfiguredDefaultView ::: Fallback to default. Loading setting-view");
      }
  }
}



function loadDefaultView()
{
    console.log("loadDefaultView ::: Start");

    // read from local storage
    var curDefaultView = readLocalStorage("defaultView");

    if(curDefaultView === null) // no default view configured
    {
        console.log("loadDefaultView ::: No default configured");
    }
    else
    {
        console.log("loadDefaultView ::: Found configured default view: " + curDefaultView);
        loadService(curDefaultView);
    }

    console.log("loadDefaultView ::: End");
}


/**
* @name openURL
* @summary Opens a supllied url in default browser
* @description Opens a supllied url in default browser
* @param url - URL string which contains the target url
*/
function openURL(url)
{
    console.log("openURL ::: Start");

    const {shell} = require("electron");
    console.log("openURL ::: Trying to open the url: " + url);
    shell.openExternal(url);

    console.log("openURL ::: End");
}


/**
* @name loadSettings
* @summary Opens the settings page
* @description Opens the settings page where app specific settings can be configured
*/
function loadSettings()
{
    console.log("loadSettings ::: Start");

    $("#content").load("settings.html");

    console.log("loadSettings ::: End");
}


/**
* @name loadService
* @summary Opens a supllied service
* @description Loads the supplied service to the content view
* @param pageName - Name of the service
*/
function loadService(pageName)
{
    console.log("loadService ::: Start");
    console.log("loadService ::: Loading: " + pageName.toLowerCase());

    $("#content").load("services/" + pageName.toLowerCase() + ".html");

    console.log("loadService ::: End");
}

/**
* @name toggleCheckbox
* @summary Triggered on click on a service checkbox on settings page
* @description Checks which service was clicked and hides or unihdes the related menu items. Writes to local stoage in addition
* @param objectName - Name of the checkbox
*/
function toggleCheckbox(objectName)
{
    console.log("toggleCheckbox ::: Start");

    console.log("toggleCheckbox ::: Checkbox is: " + objectName);

    if($("#"+objectName).prop("checked"))
    {
        console.log("toggleCheckbox ::: Activating " + objectName);

        // write to local storage
        writeLocalStorage(objectName, "true");

        // show service in menu
        $("#menu_"+objectName.toLowerCase()).show();

        // add option to DefaultView select
        $("#selectDefaultView").append(new Option(objectName, objectName));
    }
    else
    {
        console.log("toggleCheckbox ::: Deactivating " + objectName);

        // write to local storage
        writeLocalStorage(objectName, "false");

        // hide service from menu
        $("#menu_"+objectName.toLowerCase()).hide();

        // remove option from DefaultView selectc
        //$("#selectDefaultView option[value='objectName']").remove();
        $("#selectDefaultView option").each(function()
        {
          //console.warn(this.value);
          if (this.value === objectName)
          {
            console.log("toggleCheckbox ::: Deleting item from select");
            this.remove();
          }
        });
    }

    console.log("toggleCheckbox ::: End");
}


/**
* @name readLocalStorage
* @summary Read from local storage
* @description
* @param key - Name of local storage key
* @return value - The value of the supplied key
*/
function readLocalStorage(key)
{
    console.log("readLocalStorage ::: Start");
    var value = localStorage.getItem(key);
    console.log("readLocalStorage ::: Reading key: " + key + " - found value: " + value);
    return(value);
}


/**
* @name writeLocalStorage
* @summary Write to local storage
* @description
* @param key - Name of local storage key
* @param value - New value
*/
function writeLocalStorage(key, value)
{
    console.log("writeLocalStorage ::: Start");
    console.log("writeLocalStorage ::: Writing key: " + key + " - with value: " + value);
    localStorage.setItem(key, value);
}



function initSettingsPage()
{
  console.log("initSettingsPage ::: Start");

  console.log("initSettingsPage ::: Show appname and version");
  var appVersion = require("electron").remote.app.getVersion();
  var appName = require("electron").remote.app.getName();
  document.getElementById("settingsAppName").innerHTML = appName;
  document.getElementById("settingsAppVersion").innerHTML = appVersion;

  console.log("initSettingsPage ::: Show enabled services in settings interface");


    // checkboxes:
    //
    // WhatsApp
    var whatsapp = readLocalStorage("WhatsApp");
    if(whatsapp === "true")
    {
        // check the checkbox
        $("#WhatsApp").prop("checked", true);

        // add to defaultView select item
        $("#selectDefaultView").append(new Option("WhatsApp", "WhatsApp"));
    }

    // Google Calendar
    //
    var calendar = readLocalStorage("GoogleCalendar");
    if(calendar === "true")
    {
        // check the checkbox
        $("#GoogleCalendar").prop("checked", true);

        // add to defaultView select item
        $("#selectDefaultView").append(new Option("GoogleCalendar", "GoogleCalendar"));
    }

    // Google Keep
    //
    var notes = readLocalStorage("GoogleKeep");
    if(notes === "true")
    {
      // check the checkbox
        $("#GoogleKeep").prop("checked", true);

        // add to defaultView select item
        $("#selectDefaultView").append(new Option("GoogleKeep", "GoogleKeep"));
    }


    // now validate the optional configured default view
    validateConfiguredDefaultView();

    console.log("initSettingsPage ::: End");
}



/**
* @name initMenu
* @summary Init the menu on app launch
* @description
*/
function initMenu()
{
    console.log("initMenu ::: Start");

    // WhatsApp
    //
    var whatsapp = readLocalStorage("WhatsApp");
    if(whatsapp === "true")
    {
        console.log("initMenu ::: Activating WhatsApp");

        // show service in menu
        $("#menu_whatsapp").show();

        // Add service to startup service select
        $("#selectDefaultView").append(new Option("WhatsApp", "WhatsApp"));
    }
    else
    {
        console.log("initMenu ::: Deactivating WhatsApp");

        // hide service from menu
        $("#menu_whatsapp").hide();
    }


    // Google Calendar
    //
    var calendar = readLocalStorage("GoogleCalendar");
    if(calendar === "true")
    {
        console.log("initMenu ::: Activating GoogleCalendar");
        $("#menu_googlecalendar").show();
        $("#selectDefaultView").append(new Option("GoogleCalendar", "GoogleCalendar"));
    }
    else
    {
        console.log("initMenu ::: Deactivating GoogleCalendar");
        $("#menu_googlecalendar").hide();
    }

    // Google Keep
    //
    var notes = readLocalStorage("GoogleKeep");
    if(notes === "true")
    {
        console.log("initMenu ::: Activating GoogleKeep");
        $("#menu_googlekeep").show();
        $("#selectDefaultView").append(new Option("GoogleKeep", "GoogleKeep"));
    }
    else
    {
        console.log("initMenu ::: Deactivating GoogleKeep");
        $("#menu_googlekeep").hide();
    }

    console.log("initMenu ::: End");
}



/**
* @name checkDisplaySize
* @summary Gets the display size and adjusts the window according to it
* @description Gets the display size and adjusts the window size to it. In addition the window gets centered (see main.js)
*/
function checkDisplaySize()
{
    console.log("checkDisplaySize ::: Start");

    // get current screen size
    var monitorWidth = screen.width;
    var monitorHeight = screen.height;
    console.log("checkDisplaySize ::: Detected screen size is: " + monitorWidth + "x" + monitorHeight);

    // set new window size
    var windowWidth = monitorWidth * 0.8;
    var windowHeight = monitorHeight * 0.8;


    // resize & center window
    //
    const {ipcRenderer} = require("electron");
    ipcRenderer.send("resize-me-please", windowWidth, windowHeight);

    console.log("checkDisplaySize ::: End");
}
