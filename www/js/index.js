var Appointments = new AppointmentCollection();
var Questions = new QuestionContainerList();
var Config = new Configuration({id: 1});
var _t= null;

var app = {
    // Application Constructor
    initialize: function() {
        if (window.cordova){
            this.bindEvents();
        }else{
            app.onDeviceOnline();
        }
    },

    onDeviceOffline: function(){
        app.receivedEvent('onDeviceOffline');
        alert('Please check your internet connection and restart!');
        navigator.app.exitApp();
    },

    onDeviceOnline: function(){
        app.receivedEvent('onDeviceOnline');

        // hide splashscreen
        if (navigator.splashscreen){
            setTimeout(function() {
                navigator.splashscreen.hide();
            }, 2000);
        }

        var router = new Router();
        //verify if a language was previously selected by the user
        Config.fetch();
        var language= Config.get('appLanguage');
        // initialize i18next to get the correct translation of the app's texts
        var options= {debug: true, lng: language, load: 'all', fallbackLng: 'de', 
        resources: 
        {
    de : {
        translation: {
            "titleHome" : "Reflect.UP",
            "impressum" : "Impressum",
            "title_login" : "Reflect.UP - Anmeldung",
            "loginError" : "Login fehlgeschlagen!",
            "loginRunning" : "Login läuft...",
            "userName" : "Benutzername",
            "userName_placeHolder" : "Benutzername ohne @uni...",
            "password" : "Passwort",
            "password_placeHolder" : "Passwort",
            "submit" : "Anmelden",
            "welcomeMessage_1" : "Um den angeforderten Dienst nutzen zu können, musst du dich hier einloggen.",
            "welcomeMessage_2" : "Bitte verwende zur Anmeldung als Benutzername dein Mailkürzel ohne @uni-potsdam.de.",
            "setupMessage" : "Da gibt es verschiedene Kurse zum Wahlen:",
            "titleQuestions" : "Reflexionsfragen",
            "teaser_1" : "Du hast noch nicht alle Reflexionsfragen beanwortet! Nimm Dir ein Wenig Zeit und gehe die fehlenden Fragen durch.",
            "questions_button" : "Zu den Reflexionsfragen",
            "teaser_2" : "Weitere Reflexionsfragen folgen in Kürze!",
            "headerFinish" : "Fertig",
            "messageFinish" : "Vielen Dank, Du hast alle Fragen beanwortet",
            "buttonFinish" : "Fertig",
            "questionCounter" : "Frage ",
            "backButton" : "Zurück",
            "nextButton" : "Weiter",
            "feedbackHeader" : "Feedback abgeben",
            "feedbackMessage_1" : "Du bist gefragt! Dir fällt bei Deinem Studieneinstieg etwas auf, das verbessert werden könnte? Du hast Anregungen zu Deinem Studium, Lob oder Kritik? Teil es uns mit! Jederzeit!",
            "feedbackMessage_2" : "Natürlich freuen wir uns auch über Rückmeldungen zur App, damit wir sie kontinuierlich an Deine Bedürfnisse anpassen können.",
            "feedbackButton" : "Abschicken",
            "feedbackFinish_header" : "Fertig",
            "feedbackFinish_message" : "Feedback erfolgreich abgeschickt.",
            "feedbackFinish_button" : "Fertig",
            "feedbackTeaser" : "Du musst eine Anwort auswählen.",
            "appointmentsTitle" : "Termine",
            "contactHeader" : "Ansprechpartner",
            "panelMenu" : "Menu",
            "panelAppointments" : "Weitere Termine",
            "panelQuestions" : "Reflexionsfragen",
            "panelContact" : "Ansprechpartner",
            "panelFeedback" : "Feedback",
            "panelHome" : "Home",
            "panelLanguages" : "Sprachen / Languages",
            "languageMessage" : "Möchtest du die Sprache der App wechseln? Bitte wahlen:",
            "panelLogout" : "Logout",
            "infoMessage_1" : "In erster Linie beantwortest du die Fragen für dich. Diese App möchte dich lediglich auf deinem Lernprozess begleiten und dir hilfreich zur Seite zu stehen. Ziel ist es weniger, dich mit Faktenwissen zu bombardieren, sondern dich dabei zu unterstützen deine reflexiven Kompetenzen weiterzuentwickeln und kompetente Eigenverantwortlichkeit zu fördern. Deshalb gibt es auch keine richtigen und falschen Antworten. $t(infoMessage_2)",
            "infoMessage_2" : "Die Beantwortung der Fragen sowie deren Auswertung erfolgt anonym."
        }
    },
    en : {
        translation : {
            "titleHome" : "Reflect.UP",
            "impressum" : "References",
            "title_login" : "Reflect.UP - Login",
            "loginError" : "Login failed!",
            "loginRunning" : "Logging in...",
            "userName" : "Username",
            "userName_placeHolder" : "Username without @uni...",
            "password" : "Password",
            "password_placeHolder" : "Password",
            "submit" : "Submit",
            "welcomeMessage_1" : "In order to use this service you must first login.",
            "welcomeMessage_2" : "Please use only the initial part of your email without @uni-potsdam.de.",
            "setupMessage" : "Here you can see the different courses you can choose from:",
            "titleQuestions" : "Quizzes",
            "teaser_1" : "You haven't answered all the quizzes yet! Take a little time and go through the remaining questions.",
            "questions_button" : "To the quizzes",
            "teaser_2" : "More quizzes are comming shortly!",
            "headerFinish" : "Done",
            "messageFinish" : "Thank you, you just answered all questions.",
            "buttonFinish" : "Done",
            "questionCounter" : "Question ",
            "backButton" : "Back",
            "nextButton" : "Next",
            "feedbackHeader" : "Send feedback",
            "feedbackMessage_1" : "Your opinion is important! Do you think something could be done better regarding the starting phase of your studies? Would you like to suggest something, either a compliment or critique? Share it with us anytime!",
            "feedbackMessage_2" : "We will also be happy to get feedback about the App, to continually adapt it to your needs.",
            "appointmentsTitle" : "Appointments",
            "feedbackButton" : "Send",
            "feedbackFinish_header" : "Done",
            "feedbackFinish_message" : "Feedback has been successfully sent.",
            "feedbackFinish_button" : "Done",
            "feedbackTeaser" : "You must choose an answer.",
            "contactHeader" : "Contact",
            "panelMenu" : "Menu",
            "panelAppointments" : "All appointments",
            "panelQuestions" : "Quizzes",
            "panelContact" : "Contact",
            "panelFeedback" : "Feedback",
            "panelHome" : "Home",
            "panelLanguages" : "Languages",
            "languageMessage" : "Would you like to change the language of the app? Please choose:",
            "panelLogout" : "Logout",
            "infoMessage_1" : "This is a self-testing exercise. This App is ment to assist you during your learning process, being a useful tool in your hand. By using it, you are not expected to learn a large amount of facts, but to make it easier to develop your own flexible competences and sense of responsability. Therefore there are no right or wrong answers. $t(infoMessage_2)",
            "infoMessage_2" : "The answers are submitted and checked in an anonymous way."
        }
    },
    es : {
        translation : {
            "titleHome" : "Reflect.UP",
            "impressum" : "Referencias",
            "title_login" : "Reflect.UP - Login",
            "loginError" : "Error al acceder.",
            "loginRunning" : "Accediendo...",
            "userName" : "Nombre de usuario",
            "userName_placeHolder" : "Nombre de usuario sin @uni...",
            "password" : "Contraseña",
            "password_placeHolder" : "Contraseña",
            "submit" : "Acceder",
            "welcomeMessage_1" : "Para poder usar el servicio necesitas acceder a tu cuenta.",
            "welcomeMessage_2" : "Escribe solamente la parte inicial de tu correo electrónico sin @uni-potsdam.de",
            "appointmentsTitle" : "Citas",
            "setupMessage" : "Aquí puedes ver los diferentes cursos para elegir:",
            "titleQuestions" : "Encuestas",
            "teaser_1" : "¡No has contestado todas las encuestas todavía! Tómate un momento para contestar el resto de las preguntas.",
            "questions_button" : "A las encuestas",
            "teaser_2" : "¡Más encuestas vienen próximamente!",
            "headerFinish" : "Listo",
            "messageFinish" : "Muchas gracias, has respondido a todas las preguntas.",
            "buttonFinish" : "Listo",
            "questionCounter" : "Pregunta ",
            "backButton" : "Anterior",
            "nextButton" : "Siguiente",
            "feedbackHeader" : "Enviar feedback",
            "feedbackMessage_1" : "¡Tu opinión es importante! ¿Crees que se podría mejorar algo con respecto a la fase inicial de tus estudios? ¿Te gustaría sugerir algo, ya sea positivo o una crítica? ¡Compártelo con nosotros en cualquier momento!",
            "feedbackMessage_2" : "Desde luego, nos dará gusto recibir comentarios sobre la aplicación, para poder adaptarla a tus necesidades.",
            "feedbackButton" : "Enviar",
            "feedbackFinish_header" : "Listo",
            "feedbackFinish_message" : "Tus comentarios han sido enviados.",
            "feedbackFinish_button" : "Listo",
            "feedbackTeaser" : "Para seguir debes elegir una respuesta.",
            "contactHeader" : "Contacto",
            "panelMenu" : "Menú",
            "panelAppointments" : "Más citas",
            "panelQuestions" : "Encuestas",
            "panelContact" : "Contacto",
            "panelFeedback" : "Feedback",
            "panelHome" : "Inicio",
            "panelLanguages" : "Idiomas",
            "languageMessage" : "¿Te gustaría cambiar el idioma de la aplicación? Por favor elige:",
            "panelLogout" : "Salir",
            "infoMessage_1" : "Este es un ejercicio de auto-evaluación. Esta aplicación es para ayudarte durante tu proceso de aprendizaje, siendo una herramienta útil a tu alcance. Al utilizarla, no se espera que aprendas una gran cantidad de hechos, sino que sea más fácil desarrollar tus propias competencias flexibles y sentido de responsabilidad. Por lo tanto, no hay respuestas correctas o incorrectas. $t(infoMessage_2)",
            "infoMessage_2" : "La verificación de las respuestas sucede de manera anónima."
        }
    }}
    };
        i18next.init(options,function(t){
            _t= t;
            Backbone.history.start();
        });

        //sometimes the menu-options are not inmediately loaded afteer i18next is initialized;
        //  therefore, the individual elements are filled during launch time of the app
        $('#panel-menu').text(i18next.t("panelMenu"));
        $('#more-appointments-button').text(i18next.t("panelAppointments"));
        $('#more-questions-button').text(i18next.t("panelQuestions"));
        $('#panel-contact-persons').text(i18next.t("panelContact"));
        $('#panel-feedback').text(i18next.t("panelFeedback"));
        $('#panel-languages').text(i18next.t("panelLanguages"));
        $('#panel-home').text(i18next.t("panelHome"));
        $('#panel-logout').text(i18next.t("panelLogout"));
        $('#infopanel-content').html(i18next.t("infoMessage_1"));
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);

    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');

        // listener for links including target = _blank, will be opened with InAppBrowser
        $(document).ready(function(){
            $('body').on('click', 'a[target="_blank"]', function (e) {
                console.log('link external');
                e.preventDefault();
                window.open = cordova.InAppBrowser.open;
                window.open($(e.currentTarget).attr('href'), '_system', '');
            });
        });

        // PushService
        PushServiceRegister();

        if((navigator.network.connection.type).toUpperCase() != "NONE" && (navigator.network.connection.type).toUpperCase() != "UNKNOWN") {
            app.onDeviceOnline();
        }else{
            app.onDeviceOffline();
        }

    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    }
};