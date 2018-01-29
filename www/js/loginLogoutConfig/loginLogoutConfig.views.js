/**
 *  @module  loginLogoutConfig.views
 */
define([
    'jquery',
    'backbone',
    'util',
    'appointment/appointment.views',
    'question/question.views',
    'loginLogoutConfig/loginLogoutConfig.models'
], function(jquery, Backbone, config, appointmentViews, questionViews, loginLogoutConfigViews) {
    'use strict';


    /**  vie for the HomeView
     *      @name HomeView
     *      @constructor
     *      @augments Backbone.View
     */
    var HomeView = Backbone.View.extend(/** @lends HomeView.prototype */{
        el : "#app",
        template : _.template($('#template-home-screen').html()),
        /** @type {Configuration} */
        model: app.models.Configuration,

        events: {
            'click .footerlink': 'impressum'
        },

        initialize : function() {
            this.model = new config.Configuration({id:1});;
            this.authorize();
        },

        authorize: function(){
            this.model.fetch();
            var token = this.model.get("moodleAccessToken");
            // get the parameters: service-end-point and access token
            //	from config model
            var that = this;
            // submit test call to check whether token is still valid
            $.ajax({
                url: that.model.get('moodleServiceEndpoint'),
                data: {
                    wstoken: that.model.get("moodleAccessToken"),
                    wsfunction: "local_reflect_get_calendar_entries",
                    moodlewsrestformat: "json",
                    courseID : this.model.get('courseID')
                },
                headers: that.model.get("accessToken")
            }).done(function(data){
                //console.log(data);
                if ((data.errorcode == 'invalidtoken') || token == ""){
                    Backbone.history.navigate('initialSetup', { trigger : true });
                }
            }).error(function(xhr, status, error){
                console.log(xhr.responseText);
                console.log(status);
                console.log(error);
            });
        },

        impressum: function(){
            Backbone.history.navigate('impressum', { trigger : true });
        },

        render : function(){
            this.$el.html(this.template({t: _t}));

            this.AppointmentListView = new appointmentViews.AppointmentListView({
                el : '#dates',
                model : app.models.Appointments,
                limit : 3
            });

            this.QuestionCollectionListView = new questionViews.QuestionCollectionListView({
                el: '#questions',
                model: app.models.Questions,
                showNotice: true
            });

            return this;
        }
    });

    /**		View - InitialSetupView
     *      @name InitialSetupView
     *      @constructor
     *      @augments Backbone.View
     */
    var InitialSetupView = Backbone.View.extend(/** @lends InitialSetupView.prototype */{
        el: '#app',
        template: _.template($('#template-initial-setup').html()),
        events: {
            'click .courseBlock' : 'writeConfigAttributes',
            'click .infobutton' : 'toggleInfoBox',
            'click #languages_button' : 'openLanguagesPage',
        },
        /** @type {Configuration} */
        model: app.models.Configuration,

        initialize: function(){
            this.model = new config.Configuration({id:1});
            this.collection = new loginLogoutConfigViews.TabCollection();
            var that = this;
            var onDataHandler = function(collection, response, options) {
                console.log('configuration object fetched from server');
                that.render();
            };

            var onErrorHandler = function(collection, response, options) {
                that.collection.url = 'js/config.json';
                that.collection.fetch();
                console.log("collection fetched from url: "+that.collection.url);
                that.render();
            };

            this.collection.fetch({success : onDataHandler, error: onErrorHandler, headers: {'Authorization' :'Bearer 732c17bd-1e57-3e90-bfa7-118ce58879e8'} });
            this.listenTo(this.collection, "sync", this.render);

        },

        render: function(){
            this.$el.html(this.template({tabs: this.collection, t:_t}));
            return this;
        },

        toggleInfoBox: function(ev){
            var element = $(ev.currentTarget);
            $(element).toggleClass('active');
            $(element).parent().parent().find(".courseDescription").toggle();
        },

        writeConfigAttributes: function(ev){
            this.model.fetch();
            var element = $(ev.currentTarget);
            var ID = element.attr('id');
            //retrieve the parameters to be stored in Config model
            var paramsOBJ = this.collection.get(ID);
            this.model.set('accessToken',paramsOBJ.get('accessToken'));
            this.model.set('moodleServiceEndpoint',paramsOBJ.get('moodleServiceEndpoint'));
            this.model.set('moodleLoginEndpoint',paramsOBJ.get('moodleLoginEndpoint'));
            this.model.set('impressumTemplate',paramsOBJ.get('impressumTemplate'));
            this.model.set('uniLogoPath',paramsOBJ.get('uniLogoPath'));
            this.model.set('courseID',paramsOBJ.get('courseID'));
            this.model.set('pushDetails',paramsOBJ.get('pushDetails'));
            console.log('recorded the course ID:'+paramsOBJ.get('courseID'));
            // save model to local storage
            this.model.save();
            // navigate to the normal login page
            Backbone.history.navigate('config', { trigger : true });

        },

        openLanguagesPage: function(){
            //console.log('Triggering openLanguagesPage function!');
            this.undelegateEvents();
            Backbone.history.navigate('#languagesInit', {trigger: true});
        }

    });


    /**     LogoutView
     *      @name LogoutView
     *      @constructor
     *      @augments Backbone.View
     */
    var LogoutView = Backbone.View.extend(/** @lends LogoutView.prototype */{
        el: '#app',

        initialize: function() {
            this.model = new config.Configuration({id:1});
            this.model.fetch();
            this.model.destroy({
                success: this.reroute,
                error: this.retryDestroy
            });
            // unsubscribe from push notification service
            UnsubscribeToUniqush(this.model.get('pushDetails'));
        },

        reroute: function() {
            Backbone.history.navigate('initialSetup', {trigger: true});
            //if(navigator.app){
            //    navigator.app.exitApp();
            //}
        },

        retryDestroy: function() {
            this.model.destroy();
            this.reroute();
        }
    });


    /**     View - ConfigView
     *      @name ConfigView
     *      @constructor
     *      @augments Backbone.View
     */
    var ConfigView = Backbone.View.extend(/** @rends ConfigView.prototype */{
        el: '#app',

        template: _.template($('#template-config-screen').html()),
        events: {
            'submit #loginform': 'submit',
            'click .footerlink_Config': 'impressum_config'
        },
        /** @type {Configuration} */
        model: app.models.Configuration,

        initialize: function(){
            this.model = new config.Configuration({id:1});
            this.listenTo(this, 'errorHandler', this.errorHandler);
            this.listenTo(this, 'enrolUser', this.enrolUser);
            this.render();
        },

        /**
         *  TODO: Error Handling
         */
        submit: function(ev){
            this.model.fetch();
            ev.preventDefault();
            var username = $('#username').val();
            var password = $('#password').val();

            this.$(".loginerror").hide();
            this.$(".loginform").hide();
            this.$(".loginrunning").show();

            var that = this;
            console.log('Login - token stored in local memory within Config model: '+window.JSON.stringify(this.model.get("accessToken")));
            $.ajax({
                url: that.model.get("moodleLoginEndpoint"),
                data: {
                    username: username,
                    password: password,
                    service: 'reflect'
                },
                headers: that.model.get("accessToken")
            }).done(function(data){
                //console.log(data);
                if (data.error){
                    that.trigger('errorHandler');
                }else{
                    that.model.set("moodleAccessToken", data.token)
                    that.model.save();
                    that.trigger('enrolUser');
                }
            }).error(function(xhr, status, error){
                console.log(xhr.responseText);
                console.log(status);
                console.log(error);
                that.trigger('errorHandler');
            });

        },

        enrolUser: function(){
            this.model.fetch();
            // now that the course's id is set, it is possible to subscribe the app to
            // the right service
            if (window.device)
                PushServiceRegister(this.model.get('courseID'), this.model.get('pushDetails'));
            var that = this;
            console.log("current moodle access token: "+that.model.get('moodleAccessToken'));
            $.ajax({
                url: that.model.get('moodleServiceEndpoint'),
                data: {
                    wstoken: that.model.get("moodleAccessToken"),
                    wsfunction: "local_reflect_enrol_self",
                    moodlewsrestformat: "json",
                    courseID : that.model.get('courseID')
                },
                headers: that.model.get("accessToken")
            }).done(function(data){
                if (data.error){
                    that.trigger('errorHandler');
                }else{
                    that.undelegateEvents();
                    Backbone.history.navigate('', { trigger : true });
                }
            }).error(function(xhr, status, error){
                console.log(xhr.responseText);
                console.log(status);
                console.log(error);
                that.trigger('errorHandler');
            });
        },

        errorHandler: function(){
            // retry authentication
            console.log('errorHandler');
            // display error message
            this.$(".loginerror").show();
            this.$(".loginform").show();
            this.$(".loginrunning").hide();
        },

        impressum_config: function(){
            Backbone.history.navigate('impressumConfig', { trigger : true });
        },

        render: function(){
            //call tab view
            this.$el.html(this.template({t: _t}));
            return this;
        }
    });

    return {
        HomeView : HomeView,
        ConfigView : ConfigView,
        InitialSetupView : InitialSetupView,
        LogoutView : LogoutView
    }

});