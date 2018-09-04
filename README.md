# Reflect.UP - App für die Studieneingangsphase

## Kurze Beschreibung
Die App ist für alle Studierenden der Universität Potsdam geeignet, besonders in der Studieneingangsphase.

## Vollständige Beschreibung
Spielend leicht durch’s erste Semester und das Studium!
Die Anwendung weist Dich auf wichtiges Wissen, das es im Unialltag zu beherrschen gilt hin und hilft Dir dabei deinen Kompetenzerwerb im Blick zu behalten. So kannst Du immer sicher sein, was Du am Ende eines Semesters können musst. Das alles erfährst Du mittels kleiner Wissens- und Selbsteinschätzungsfragen.
Wenn Dir etwas auffällt, das verbessert werden sollte, dann trage es einfach ein und Dein Feedback erreicht die Studienorganisation.
Nichts mehr verpassen – die App erinnert Dich an alle wichtigen Termine rund ums Studium.

Features:
- Wissens- und Kompetenzreflexion über
    - MC-Fragen
    - Freitext-Fragen
    - Single-Choice Fragen
- Freitext-Feedback
- Ansprechpartner
- Anzeige studienrelevanter Termine
    - Möglichkeit des ausblenden von Terminen
    - Erinnerungsfunktion
- Versenden von Push-Notifikationen
- Verwaltung mehrere Kurse und Informationen

Achtung, die App ist noch am Anfang ihrer Entwicklung. Wir sind für hilfreiche Tipps, Verbesserungsvorschläge und Anregungen dankbar.

## Allgemeine Informationen

Informationen finden Sie unter:
- [Slideshare Präsentaion Mobil in und aus Situationen lernen](http://de.slideshare.net/alekiy/reflectup-mobil-in-und-aus-situationen-lernen)
- [Projektwebseite](https://www.uni-potsdam.de/reflectup/)


## Projektstruktur

```
- res
- resources
- src
 - app
 - assets
 - components (GUI-Komponenten)
 - lib
 - pages (Seiten)
 - providers (Hilfsfunktionen)
 - theme
 - ...
...
- config.xml
- package.json
...
```

## Installation

### 1. App installieren

1. `git clone https://github.com/University-of-Potsdam-MM/Reflect.UP.git` ausführen
2. `git submodule init` (Submodule initialisieren)
3. `git submodule update` (Submodul beziehen)
4. `npm install` (Dependencies installieren)
5. `ionic serve` (App im Browser ausführen)

### 2. App auf nativen Endgerät installieren

1. `ionic cordova platform add android`
2. `ionic cordova prepare android`
3. `ionic cordova run android`

### 3. Release-Build vorbereiten

#### Android

1. `ionic cordova build android --prod --release`
2. `jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore reflectup.keystore app-release-unsigned.apk reflectup`
3. `zipalign -v 4 app-release-unsigned.apk ReflectUP.apk`


#### iOS
1. `ionic cordova build ios --prod --release`
2. Projekt mit XCode öffnen und notwendige Permissions (Push-Notification) setzen


Hinweis: Unter iOS müssen bei Capabilities Push-Notifications aktiviert werden, siehe hierzu auch den Wiki-Beitrag [Push-Nachrichten](https://github.com/University-of-Potsdam-MM/Reflect.UP/wiki/Push-Nachrichten)

#### Optionale Punkte: CSS-Anpassungen

- `src/app/app.scss` anpassen

#### App konfigurieren
- Anpassung der Konfiguration (Kurse, Endpoints, Ansprechpartner etc.) unter `src/app/assets/config.json`


### 2. Moodle-Webservices aktivieren

#### Informationen zum Moodle-Webservice API
- https://docs.moodle.org/dev/Web_services_API
- https://docs.moodle.org/dev/Web_service_API_functions

siehe https://docs.moodle.org/29/en/Using_web_services
- Plugins -> Web Services -> Manage Protocols -> Enable REST
- "create Token" capability für die entspr. User aktivieren
- "Web Service Rest" cap. für entspr. User aktivieren

### 3. Reflection-Webservice installieren

- siehe hierzu https://github.com/University-of-Potsdam-MM/reflect-local_reflection

### 4. Pushnotification-Block installieren

- siehe hierzu https://github.com/University-of-Potsdam-MM/reflect-block_pushnotification

#### Konfirugration von AirNotifier

Die Konfiguration der App zum Nutzen des jeweiligen Push-Service ist etwas umfangreicher. Eine Anleitung für den AirNotifier findet sich hier:

- https://github.com/airnotifier/airnotifier/wiki/Installation#set-up-airnotifier


## Konfiguration

### 1. Kurse anlegen
- Kurse anlegen und wie gewünscht mit Terminen & Feedbacks befüllen
- Block `reflect-block_pushnotification` hinzufügen
- Kurs über die ID im Webservice `reflect-local_reflection` freigeben

### 2. Konfiguration in `src/app/assets/config.json` anpassen

 Parameter, Endpoints, Credentials, Metainformationen und Ansprechpartner in der Config `src/app/assets/config.json` anpassen.

 Ein Beispiel mit Erläuterungen sind hier zu entnehmen `src/app/assets/config-sample.json` .