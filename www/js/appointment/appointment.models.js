/**
 *  @module  appointment.models
 */
define([
    'jquery',
    'backbone',
    'util'
], function(jquery, Backbone, config) {
    'use strict';


    /**     model for holding the appointments
     *      @name Appointment
     *      @constructor
     *      @augments Backbone.Model
     */
    var Appointment = Backbone.Model.extend({
        // the visible attribute of this model defines if the appointment is visible from
        // the start page of the application.
        defaults:{
            title : 'Appointment Title',
            fullTitle : '',                 //attribute used to hold the whole title including multilingual-tags
            begin : new Date(),                 // if these exist. Necessary for language independent comparisons.
            end : new Date(),
            toNotify: false,
            visible: true,
        }
    });


    /**     Collection - AppointmentCollection
     *      @name AppointmentCollection
     *      @constructor
     *      @augments MoodleCollection
     */
    var AppointmentCollection = config.MoodleCollection.extend(/** @lends AppointmentCollection.prototype */{
        /** @type {Appointment} */
        model : Appointment,

        sync: function(method, model, options){

            var today = new Date();
            var oneYearLater = new Date();
            oneYearLater.setFullYear(today.getFullYear()+1);
            var Config = new config.Configuration({id:1});
            Config.fetch();
            var token = Config.get('moodleAccessToken');
            var that= this;
            $.ajax({
                url: Config.get('moodleServiceEndpoint'),
                data: {
                    wstoken: token,
                    wsfunction: "local_reflect_get_calendar_entries",
                    moodlewsrestformat: "json",
                    events : {
                        eventids: [],
                        courseids: [],
                        groupids: [],
                    },
                    options: {
                        userevents: 0,
                        siteevents: 0,
                        timestart : Math.floor(today.getTime() / 1000),
                        timeend: Math.floor(oneYearLater.getTime() / 1000),
                        ignorehidden: 1,
                    },
                    courseID : Config.get('courseID')
                },
                headers: Config.get('accessToken')
            })

            .done(function(data) {
                //console.log(data);
                if (data.message) {
                    if (options && options.error)
                        options.error(data.message);

                    return;
                }

                if (options && options.success)
                    if (!data.events || data.events.length == 0){
                            options.success([]);
                            return;
                    }

                    var result = new Array();

                    _.each(data.events, function(item){
                        // don't display events with modulename feedback
                        if (item.modulename == "feedback")
                            return true;
                        // start parsing of objects
                        var itemName= item.name;
                        //checking for multi language tags
                        var matchPattern= /<span lang=/i;
                        var found= itemName.search(matchPattern);
                        var title_with_tags= '';
                        if (found != -1){
                            title_with_tags= itemName;
                        }
                        // 'name' and 'description' attributes are to be checked for multi language tags
                        var language= Config.get('appLanguage');
                        itemName= that.processMoodleContents(language,itemName);
                        var itemDescription= item.description;
                        itemDescription= that.processMoodleContents(language,itemDescription);
                        //check if the model to be added is listed in the list of appointments to notify,
                        //in that case, the model's attribute toNotify is set to be true
                        var notifyListSTR = Config.get('notificationsList');
                        var notifyListOBJ = window.JSON.parse(notifyListSTR);
                        var numElements = notifyListOBJ.titlesToNotify.length;
                        var notifyable = 0;
                        var toNotify = false;
                        var visible = false;
                        for(var s=0; s<numElements; s++){
                            var appointmentsTitle= notifyListOBJ.titlesToNotify[s];
                            if(appointmentsTitle == itemName || appointmentsTitle == title_with_tags){
                                notifyable= 1;
                                break;
                            }
                        }
                        if(notifyable == 1){
                            toNotify = true;
                        }else{
                            toNotify = false;
                        }
                        // at this point, there must be a checking to see wether the model to be added exists
                        // in the list of removed appointmets; in case it is, the visible attribute is set to
                        // false, and the appointment is not shown within the start page
                        var apListSTR = Config.get('appointmentList');
                        var apListOBJ = window.JSON.parse(apListSTR);
                        var numAppointments = apListOBJ.removedTitles.length;
                        var deleted = 0;
                        for (var k=0; k<numAppointments; k++){
                            var appointmentModelsTitle = apListOBJ.removedTitles[k];
                            if(appointmentModelsTitle == itemName || appointmentModelsTitle == title_with_tags){
                                deleted = 1;
                                break;
                            }
                        }
                        if(deleted != 1){
                            visible = true;
                        }else{
                            visible = false;
                        }
                        result.push(new Appointment({
                            title : itemName,
                            fullTitle : title_with_tags,
                            description : itemDescription,
                            begin : new Date(item.timestart * 1000),
                            end: new Date((item.timestart + item.timeduration)*1000),
                            toNotify : toNotify,
                            visible : visible
                        }));
                    });
                    options.success(result);
            });

        }
    });

    return {
        AppointmentCollection : AppointmentCollection
    }

});