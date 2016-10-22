Reflect.UP - Reflexions-App der Universität Potsdam
============

Allgemeine Informationen: http://de.slideshare.net/alekiy/reflectup-mobil-in-und-aus-situationen-lernen

## Projektstruktur
```
 - src
   - app (Phonegap App)
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

## PhoneGap

- http://phonegap.com
- http://docs.build.phonegap.com/en_US/introduction_getting_started.md.html

## Moodle-Webservice

### Moodle-Webservice entwickeln
- https://docs.moodle.org/dev/Web_services_API

### Moodle-Webservice API
- https://docs.moodle.org/dev/Web_service_API_functions
 
# Installation

## 1. Moodle-Webservices aktivieren 

siehe https://docs.moodle.org/29/en/Using_web_services
- Plugins -> Web Services -> Manage Protocols -> Enable REST
- "create Token" capability für die entspr. User aktivieren
- "Web Service Rest" cap. für entspr. User aktivieren

## 2. Reflection-Webservice installieren

- siehe hierzu https://github.com/University-of-Potsdam-MM/reflect-local_reflection

## 3. Kurs anlegen
- Kurs mit ID UPR1 anlegen (Kurs muss sichtbar sein)
- Termine anlegen

