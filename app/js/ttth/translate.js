function doTranslate()
{
  console.log("doTranslate ::: Start");


  var i18next = require('i18next');
  var Backend = require('i18next-sync-fs-backend');

  // should try to detect the user language 
  // and then set the related lang if available
  var LanguageDetector = require('i18next-electron-language-detector');

  i18next
  .use(Backend)
  .use(LanguageDetector)
  .init({
    debug: true,
    whitelist: ['en', 'de'],
    lng: 'en',
    fallbackLng: 'en',
    ns: 'translation',
    defaultNS: 'translation',
    updateMissing: false,
    initImmediate: true,
    backend: {
      // path where resources get loaded from 
      loadPath: __dirname + '/locales/{{lng}}/{{ns}}.json',

      // path to post missing resources 
      addPath: __dirname +  '/locales/{{lng}}/{{ns}}.missing.json',


    // jsonIndent to use when storing json files 
    jsonIndent: 2
  }
});

  $(function(){
    $('[i18n-text]').each(function(){
      var node = $(this), key = node.attr('i18n-text');
      node.text(i18next.t(key));
    });
    $('[i18n-title]').each(function(){
      var node = $(this), key = node.attr('i18n-title');
      node.attr('title', i18next.t(key));
    });
  });

  console.log("doTranslate ::: End");

}
