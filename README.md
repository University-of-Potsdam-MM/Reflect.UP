Reflect.UP - Reflektions-App der Universität Potsdam
============

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
   - moodle_plugin
     - upreflection (Moodle Webservice)
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

## 2. upreflection-Webservice installieren

- upreflection-Ordner unter Moodle-Installation/local verschieben
- Als Admin in Moodle einloggen und Plugin installieren.
- Ggf. Funktionen für Nutzende aktivieren (siehe auch https://docs.moodle.org/29/en/Using_web_services)
