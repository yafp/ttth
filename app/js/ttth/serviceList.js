/* global _ */

// -----------------------------------------------------------------------------
// AVAILABLE SERVICES
// -----------------------------------------------------------------------------
var ttthAvailableServices = new Array(
    "Freenode",
    "GitHub",
    "GoogleCalendar",
    "GoogleContacts",
    "GoogleDrive",
    "GoogleKeep",
    "GoogleMail",
    "GoogleMessages",
    "GooglePhotos",
    "Mattermost",
    "Slack",
    "Telegram",
    "Threema",
    "Twitter",
    "WhatsApp",
    "Xing",
);

// -----------------------------------------------------------------------------
// SERVICE URLS
// -----------------------------------------------------------------------------
var ttthServicesUrls = new Array(
    "https://webchat.freenode.net",
    "https://github.com/",
    "https://calendar.google.com/calendar/r",
    "https://contacts.google.com/",
    "https://drive.google.com/drive/",
    "https://keep.google.com/",
    "https://mail.google.com/mail/",
    "https://messages.google.com/web",
    "https://photos.google.com/",
    "https://", // Mattermost is using user specific custom url
    "https://", // Slack needs a user specific workspace
    "https://web.telegram.org/",
    "https://web.threema.ch/",
    "https://mobile.twitter.com/",
    "https://web.whatsapp.com/",
    "https://www.xing.com/messages/conversations",
);
