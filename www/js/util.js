/**
 *  @module  util
 */
define([
    'jquery',
    'backbone',
    'backboneLocalStorage'
], function(jquery, Backbone, storage) {
    'use strict';

    // use the following URL to force the application to work with local config.json object
    var configURL = {configURL: "https://api.uni-potsdam.de/endpoints/staticContent/2.0/config.json"};
    //var configURL = "https://api.uni-potsdam.de/endpoints/staticContent/2.0/configs.json";

    /**     model for holding the configuration
     *      @name Configuration
     *      @constructor
     *      @augments Backbone.Model
     */
    var Configuration = Backbone.Model.extend({
        // necessary local storage declaration to save a single model; in this case
        // the Configuration model that holds the list of removed appointment titles.
        localStorage : new Store("Configuration"),
        defaults:{
            accessToken: '',
            moodleAccessToken: '',
            notificationsCounter: 0,
            notificationsList: '{"titlesToNotify" : []}',
            appointmentList: '{"removedTitles" : []}',
            moodleServiceEndpoint : '',
            moodleLoginEndpoint : '',
            impressumTemplate: '',
            uniLogoPath: '',
            appLanguage: 'de',
            courseID: '',
            notificationsHash: '{"initialAttribute": ""}',
            pushDetails:''
        }
    });


    /**     Collection - MoodleCollection
     *      @name MoodleCollection
     *      @constructor
     *      @augments Backbone.Collection
     */
    var MoodleCollection = Backbone.Collection.extend({
        processMoodleContents: function(language, stringToAnalize){
            //checking for multi language tags
            var domObj = $($.parseHTML(stringToAnalize));
            var result =stringToAnalize;

            if (domObj.length>1){
                _.each(domObj, function(element){
                    if ($(element)[0].lang == language){
                        result = $(element).html();
                    }
                });
            }
            return result;
        }
    });

    return {
        configURL : configURL,
        Configuration : Configuration,
        MoodleCollection : MoodleCollection
    }

});