Reflect.UP - Reflexions-App der Universität Potsdam
============

# Allgemeine Informationen

Informationen: http://de.slideshare.net/alekiy/reflectup-mobil-in-und-aus-situationen-lernen

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
       - config.xml
       - ...
       - index.html (Startpunkt der App)
```

## Cordova

- https://cordova.apache.org/

## Moodle-Webservice

### Moodle-Webservice entwickeln
- https://docs.moodle.org/dev/Web_services_API

### Moodle-Webservice API
- https://docs.moodle.org/dev/Web_service_API_functions

# Installation

## 1. App installieren

1. `npm install` ausführen
2. CSS-Anpassungen in `www/sass/index.scss`
3. `script/gulpfile.js styles` auführen
4. Optional können noch JSON und CSS minifiziert werden `gulp minify-css & gulp minify-json`
4. `cordova platform add android`
5. `cordova prepare android`
6. `cordova run android`

7. Unter iOS müssen bei Capabilities Push-Notifications aktiviert werden, siehe hierzu auch den Wiki-Beitrag [Push-Nachrichten](https://github.com/University-of-Potsdam-MM/Reflect.UP/wiki/Push-Nachrichten)


## 2. Moodle-Webservices aktivieren

siehe https://docs.moodle.org/29/en/Using_web_services
- Plugins -> Web Services -> Manage Protocols -> Enable REST
- "create Token" capability für die entspr. User aktivieren
- "Web Service Rest" cap. für entspr. User aktivieren

## 3. Reflection-Webservice installieren

- siehe hierzu https://github.com/University-of-Potsdam-MM/reflect-local_reflection
- siehe hierzu https://github.com/University-of-Potsdam-MM/reflect-block_pushnotification

## 4. Kurse anlegen
- Kurse anlegen und Endpoints sowie IDs in der `www/js/config.json` konfigurieren
- Kurs befüllen, Termine & Feedbacks anlegen