var Appointments = new AppointmentCollection();
var Questions = new QuestionContainerList();
var Config = new Configuration({id: 1});

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