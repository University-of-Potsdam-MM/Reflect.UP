/**
 *  @module  appointment.views
 */
define([
    'jquery',
    'backbone',
    'util'
], function(jquery, Backbone, config) {
    'use strict';


    /**    view for appointments
     *      @name AppointmentListItemView
     *      @constructor
     *      @augments Backbone.View
     */
    var AppointmentListItemView = Backbone.View.extend(/** @lends AppointmentListItemView.prototype */{
        /** @member{string} - tagname */
        tagName : 'li',

        initialize : function(options){
            if("fullView" in options)
                this.fullView = options.fullView;

            this.listenTo(this.model, 'change', this.render);
            this.render();
        },

        template : _.template($('#template-appointment-list-item').html()),
        /** @member {{}} - default events the view should be listening to */
        events: {
            'click .notifyAppointmentButton':'notifyButtonFunction',
            'click .cancelNotificationButton' : 'cancelNotificationFunction',
            'click' : 'toggle',
            'click .data-full':'hideButtonFunction',
            'animationend' : 'toggleAppointment',
            'webkitAnimationEnd' : 'toggleAppointment',
            'oAnimationEnd' : 'toggleAppointment',
            'MSAnimationEnd' : 'toggleAppointment',
            'mozAnimationEnd' : 'toggleAppointment',
        },

        toggle: function(){
            this.$el.find('.subdescription').toggleClass("expand");
            this.$el.find('.expandBox').toggleClass("fa-plus fa-minus");
        },

        render : function() {
            if(this.model.get('visible') == 0){
                this.$el.addClass('darkClass');
            }
            //determine if there are less than three hours left before the appointment and in that case don't show the
            //  bell icon that serves as button for notifications
            var PassedCase= false;
            var beginDate= new Date(this.model.get('begin'));
            var currTime= new Date();
            var hoursToBegin= (beginDate - currTime) / 3600000;
            if(hoursToBegin < 3)PassedCase=true;
            this.$el.html(this.template({model: this.model.toJSON(), fullView: this.fullView, passed: PassedCase}));
            return this;
        },

        scheduleNotification : function(counter,appointmentTitle,notificationMessage,notificationTime,saveCase){
            cordova.plugins.notification.local.schedule({
                id: counter,
                title: appointmentTitle,
                text: notificationMessage,
                at: notificationTime
            });
            if(saveCase == 1){
                var Config= new config.Configuration({id:1});
                Config.fetch();
                var notiListSTR= Config.get('notificationsList');
                var notiListOBJ= window.JSON.parse(notiListSTR);
                //store the new value of the notification counter for this user
                Config.set('notificationsCounter', counter);
                //if multilingual tags are present in moodle-element,
                //  the titlesToNotify list must hold a language independen-element
                var full_appointment_title= this.model.get('fullTitle');
                if(full_appointment_title != ""){
                    notiListOBJ.titlesToNotify.push(full_appointment_title);
                }else{
                    notiListOBJ.titlesToNotify.push(appointmentTitle);
                }
                notiListSTR = window.JSON.stringify(notiListOBJ);
                Config.set('notificationsList', notiListSTR);
                Config.save();
            }
        },

        displayAlert : function(){
            navigator.notification.alert(
                i18next.t("notificationAlert"),  // message
                null,         // callback
                '',            // title
                'OK'            // buttonName
            );
        },

        notifyButtonFunction : function(ev) {
            var appointmentTitle= this.model.get('title');
            var beginDate= new Date(this.model.get('begin'));
            var endDate= new Date(this.model.get('end'));
            // get the notification counter for this user, stored in the Configuration Model
            var Config= new config.Configuration({id:1});
            Config.fetch();
            var notiCounter= Config.get('notificationsCounter');
            // determine how much time is left before the start of the appointment
            //			i.e : beginTime - currentTime = amount of milliseconds to begin
            var currTime= new Date();
            var notiHashSTR= Config.get('notificationsHash');
            var notiHash= window.JSON.parse(notiHashSTR);
            var hoursToBegin= (beginDate - currTime) / 3600000;
            var self= this;
            var full_appointment_title= this.model.get('fullTitle');
            document.addEventListener('deviceready',function(){
                // manage three different cases depending on the amount of time before the beginning of the appointment
                //		case 1: more than 7 days => the user gets a notification one week before and the day before
                //		case 2: more than 1 day but less than 7 days => the user gets a notification 24 hours before the appointment
                //		case 3: less than 24 hours but more than 3 hours => the user gets a notification three hours before the appointment
                if(hoursToBegin > 168){
                    // form notification message to get a reminder one week before
                    var notificationMessage = i18next.t("notiMessage_1_0")+beginDate.getDate()+"."+('0'+(beginDate.getMonth()+1)).slice(-2);
                    if(beginDate.getTime != beginDate.getTime){
                        notificationMessage = notificationMessage.concat(i18next.t("notiMessage_1_1")+("0"+beginDate.getHours()).slice(-2)+":"+("0"+beginDate.getMinutes()).slice(-2)+i18next.t("notiMessage_1_2"));
                    }else{
                        notificationMessage = notificationMessage.concat(".");
                    }
                    // calculate the value for the time one week before the appointment
                    var notificationTime= beginDate - 604800000;
                    // only for debugging: a couple of delayed times in 15 and 30 seconds
                    //var _15_sec_after= new Date(currTime.getTime() + 15*1000);
                    //var _30_sec_after= new Date(currTime.getTime() + 30*1000);
                    notiCounter++;
                    var hash_title_el= "";
                    if(full_appointment_title != ""){
                        hash_title_el= full_appointment_title;
                    }else{
                        hash_title_el= appointmentTitle;
                    }
                    notiHash[hash_title_el]= [];
                    notiHash[hash_title_el].push(notiCounter);
                    self.scheduleNotification(notiCounter,appointmentTitle,notificationMessage,notificationTime,0);
                    // form notification message to get a reminder the day before
                    notificationMessage = i18next.t("notiMessage_2");
                    if(beginDate.getTime != beginDate.getTime){
                        notificationMessage = notificationMessage.concat(i18next.t("notiMessage_1_1")+("0"+beginDate.getHours()).slice(-2)+":"+("0"+beginDate.getMinutes()).slice(-2)+i18next.t("notiMessage_1_2"));
                    }else{
                        notificationMessage = notificationMessage.concat(".");
                    }
                    // calculate the value for the time one day before the appointment
                    notificationTime = beginDate - 86400000;
                    notiCounter++;
                    notiHash[hash_title_el].push(notiCounter);
                    notiHashSTR= window.JSON.stringify(notiHash);
                    Config.set('notificationsHash',notiHashSTR);
                    Config.save();
                    self.scheduleNotification(notiCounter,appointmentTitle,notificationMessage,notificationTime,1);
                    self.displayAlert();
                }
                if(hoursToBegin < 168 && hoursToBegin > 24){
                    // form notification message to get a reminder the day before
                    var notificationMessage = i18next.t("notiMessage_2");
                    if(beginDate.getTime != beginDate.getTime){
                        notificationMessage = notificationMessage.concat(i18next.t("notiMessage_1_1")+("0"+beginDate.getHours()).slice(-2)+":"+("0"+beginDate.getMinutes()).slice(-2)+i18next.t("notiMessage_1_2"));
                    }else{
                        notificationMessage = notificationMessage.concat(".");
                    }
                    // calculate the value for the time one day before the appointment
                    var notificationTime = beginDate - 86400000;
                    notiCounter++;
                    var hash_title_el= "";
                    if(full_appointment_title != ""){
                        hash_title_el= full_appointment_title;
                    }else{
                        hash_title_el= appointmentTitle;
                    }
                    notiHash[hash_title_el]= [];
                    notiHash[hash_title_el].push(notiCounter);
                    notiHashSTR= window.JSON.stringify(notiHash);
                    Config.set('notificationsHash',notiHashSTR);
                    Config.save();
                    self.scheduleNotification(notiCounter,appointmentTitle,notificationMessage,notificationTime,1);
                    self.displayAlert();
                }
                if(hoursToBegin < 24 && hoursToBegin > 3){
                    // form notification message to get a reminder three hours before the appointment
                    var notificationMessage = i18next.t("notiMessage_3_0");
                    if(beginDate.getTime != beginDate.getTime){
                        notificationMessage= notificationMessage.concat(i18next.t("notiMessage_1_1")+("0"+beginDate.getHours()).slice(-2)+":"+("0"+beginDate.getMinutes()).slice(-2)+i18next.t("notiMessage_3_1"));
                    }else{
                        notificationMessage= notificationMessage.concat(i18next.t("notiMessage_3_2"));
                    }
                    // calculate the value for the time three hours before the appointment
                    var notificationTime = beginDate - 10800000;
                    notiCounter++;
                    var hash_title_el= "";
                    if(full_appointment_title != ""){
                        hash_title_el= full_appointment_title;
                    }else{
                        hash_title_el= appointmentTitle;
                    }
                    notiHash[hash_title_el]= [];
                    notiHash[hash_title_el].push(notiCounter);
                    notiHashSTR= window.JSON.stringify(notiHash);
                    Config.set('notificationsHash',notiHashSTR);
                    Config.save();
                    self.scheduleNotification(notiCounter,appointmentTitle,notificationMessage,notificationTime,1);
                    self.displayAlert();
                }
                // NOTE: it is up to the user to delete the notifications from the notification center once they have been triggered
            }); // on device ready
            // change parameter toNotify in model to set the Bell icon
            this.model.set('toNotify',true);
        },

        cancelNotificationFunction : function(){
            //create the necessary hash that holds the information {appointment title: [list of notifications id-numbers]},
            //    and store the new entries whenever a notification is scheduled
            var Config= new config.Configuration({id:1});
            Config.fetch();
            var appointmentTitle= this.model.get('title');
            var full_appointment_title= this.model.get('fullTitle');
            var notiHashSTR= Config.get('notificationsHash');
            var notiHash= window.JSON.parse(notiHashSTR);
            var notiArray= [];
            if(full_appointment_title != ""){
                notiArray= notiHash[full_appointment_title];
            }else{
                notiArray= notiHash[appointmentTitle];
            }
            var that= this;
            navigator.notification.confirm(i18next.t("notiConfirmDialog"),function(buttonIndex){
                if(buttonIndex == 1){
                    return;
                }else{
                    //use this data structure to cancel the notifications with a confirmation dialog before executing:
                    //  cordova.plugins.notification.local.cancel([list_of_numberIDs],function(){callback_function},scope);
                    cordova.plugins.notification.local.cancel(notiArray,function(){
                        that.model.set('toNotify',false);
                        var notiListSTR= Config.get('notificationsList');
                        var notiListOBJ= window.JSON.parse(notiListSTR);
                        var index = 0;
                        if(full_appointment_title != ""){
                            index= _.indexOf(notiListOBJ.titlesToNotify, full_appointment_title);
                            notiListOBJ.titlesToNotify.splice(index, 1);
                        }else{
                            index = _.indexOf(notiListOBJ.titlesToNotify, appointmentTitle);
                            notiListOBJ.titlesToNotify.splice(index, 1);
                        }
                        notiListSTR= window.JSON.stringify(notiListOBJ);
                        Config.set('notificationsList',notiListSTR);
                        Config.save();
                    });
                }
            },"",[i18next.t("noButton"),i18next.t("yesButton")]);
        },

        hideButtonFunction : function(ev) {
            // get appointment list and current clicked appointment

            var currTitle= this.model.get('title');
            var Config= new config.Configuration({id:1});
            Config.fetch();
            var apListSTR = Config.get('appointmentList');
            var apListOBJ = window.JSON.parse(apListSTR);

            var full_appointment_title= this.model.get('fullTitle');

            //add class that triggers an animation on the appointment
            this.$el.addClass('out');
            if (this.$el.hasClass('darkClass')){
                // remove appointment from appointment list
                var index = 0;
                if(full_appointment_title != ""){
                    index= _.indexOf(apListOBJ.removedTitles, full_appointment_title);
                    apListOBJ.removedTitles.splice(index, 1);
                }else{
                    index = _.indexOf(apListOBJ.removedTitles, currTitle);
                    apListOBJ.removedTitles.splice(index, 1);
                }
            }else{
                //if multilingual tags are present in moodle-element,
                //  the removedTitles list must hold a language-independen element
                if(full_appointment_title != ""){
                    apListOBJ.removedTitles.push(full_appointment_title);
                }else{
                    apListOBJ.removedTitles.push(currTitle);
                }
            }

            apListSTR = window.JSON.stringify(apListOBJ);
            // save new appointmentList string to device
            Config.set('appointmentList',apListSTR);
            Config.save();

        },

        toggleAppointment : function() {
            // this block of code is executed only on the first phase of the animation of the
            // appointment-model

            if(this.$el.hasClass('in')){
                this.$el.removeClass('in');
            }

            if(this.$el.hasClass('out')){
                this.$el.removeClass('out');
                this.$el.addClass('in');
                this.$el.toggleClass('darkClass');
                if(this.$el.hasClass('darkClass')){
                    this.model.set('visible', false);
                }else{
                    this.model.set('visible', true);
                }
            }
        }

    });


    /**     view for appointmentList
     *      @name AppointmentListView
     *      @constructor
     *      @augments Backbone.View
     */
    var AppointmentListView = Backbone.View.extend(/** @lends AppointmentListView.prototype */{

        template : _.template($('#template-appointment-list').html()),
        showButton : true,
        limit : -1,
        events: {
            'error': 'onError'
        },

        initialize : function(options){
            if("showButton" in options)
                this.showButton = options.showButton;

            if("limit" in options)
                this.limit = options.limit;

            this.listenTo(this.model, 'add', this.addOne);
            this.listenTo(this.model, 'sync', this.render);
            this.model.fetch({error:this.onError});
            this.render();
        },

        render : function(){
            this.$el.html(this.template());

            if(!this.showButton)
                this.$("#more-appointments-button").hide();
            if(this.model.length){
                this.model.each( function(appointment){
                this.addOne(appointment);
                }, this)
            }

            return this;
        },

        addOne : function(appointment){
            if (this.$("#appointments").children().length < this.limit || this.limit == -1){
                if (this.limit == -1) {
                    var view = new AppointmentListItemView({model : appointment, fullView: true});

                    this.$("#appointments").append(view.el);

                }else{
                    if(appointment.get('visible') == true){
                        var view = new AppointmentListItemView({model : appointment, fullView: false});
                        this.$("#appointments").append(view.el);
                    }
                }
            }
        },

        onError: function(collection, resp, options){
            alert("Error: " + resp);
        }

    });


    /**     AppointmentsView
     *      @name AppointmentsView
     *      @constructor
     *      @augments Backbone.View
     */
    var AppointmentsView = Backbone.View.extend(/** @lends AppointmentsView.prototype */{
        el: '#app',
        template: _.template($('#template-appointments-screen').html()),

        initialize: function(){
        },

        render: function(){
            this.$el.html(this.template({t : _t}));
            this.AppointmentListView = new AppointmentListView({
                el: '#dates',
                model: app.models.Appointments,
                showButton : false,
            });
            return this;
        }
    });

    return {
        AppointmentsView : AppointmentsView,
        AppointmentListView : AppointmentListView
    }

});