Reflect.UP - Reflexions-App der Universität Potsdam
============

# Allgemeine Informationen

Informationen: [http://de.slideshare.net/alekiy/reflectup-mobil-in-und-aus-situationen-lernen](Slideshare - Mobil in und aus Situationen lernen)

## Projektstruktur
```
 - src
   - app (Cordova App)
     - ...
     - www (Hauptordner)
       - css
       - ...
       - img
       - js
        - appointment
        - contact
        - ...
        - config.json
       - ...
       - index.html (Startpunkt der App)
     - config.xml
```

## Cordova

- https://cordova.apache.org/

# Installation

## 1. App installieren

1. `npm install` ausführen
2. CSS-Anpassungen in `www/sass/index.scss`
3. `script/gulpfile.js styles` ausführen
4. Optional können noch JSON und CSS minifiziert werden `gulp minify-css & gulp minify-json`
5. Anpassungen der `config.json` und der ConfigURL in `util.js` (Unter der ConfigURL sollte die config.json auf einem Server liegen)
6. `cordova platform add android`
7. `cordova prepare android`
8. `cordova run android`

7. Unter iOS müssen bei Capabilities Push-Notifications aktiviert werden, siehe hierzu auch den Wiki-Beitrag [Push-Nachrichten](https://github.com/University-of-Potsdam-MM/Reflect.UP/wiki/Push-Nachrichten)


## 2. Moodle-Webservices aktivieren

### Informationen zum Moodle-Webservice API
- https://docs.moodle.org/dev/Web_services_API
- https://docs.moodle.org/dev/Web_service_API_functions

siehe https://docs.moodle.org/29/en/Using_web_services
- Plugins -> Web Services -> Manage Protocols -> Enable REST
- "create Token" capability für die entspr. User aktivieren
- "Web Service Rest" cap. für entspr. User aktivieren

## 3. Reflection-Webservice und Pushnotification-Block installieren

- siehe hierzu https://github.com/University-of-Potsdam-MM/reflect-local_reflection
- siehe hierzu https://github.com/University-of-Potsdam-MM/reflect-block_pushnotification

## 4. Kurse anlegen
- Kurse anlegen und Endpoints sowie IDs in der `www/js/config.json` konfigurieren
- Kurs befüllen, Termine & Feedbacks anlegen