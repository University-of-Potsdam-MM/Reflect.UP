
var Appointments = new AppointmentCollection();
var Questions = new QuestionContainerList();
var Config = new Configuration({id: 1});


var app = {
    // Application Constructor
    initialize: function() {

        this.bindEvents();

        var router = new Router();
        Backbone.history.start();

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
        PushServiceRegister();
        // hide splashscreen
        navigator.splashscreen.hide();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    }
};
