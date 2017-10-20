/**
 *  @module  views
 */
/**
 *      view for appointments
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
			var Config= new Configuration({id:1});
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
		var Config= new Configuration({id:1});
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
        var Config= new Configuration({id:1});
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


/**
 *      view for appointmentList
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
        //alert("Error: " + resp);
    }

});


/**
 *      view for questions
 *      @name QuestionCollectionListView
 *      @constructor
 *      @augments Backbone.View
 */
var QuestionCollectionListView = Backbone.View.extend(/** @lends QuestionCollectionListView.prototype */{
    template : _.template($('#template-question-collection-list').html()),
    showNotice: false,

    initialize : function(options){
        if("showNotice" in options)
            this.showNotice = options.showNotice;

        this.listenTo(this.model, 'add', this.addOne);
        this.listenTo(this.model, 'sync', this.render);
        this.model.fetch({error:this.onError});
        this.render();
    },

    render : function() {
        this.$el.html(this.template({model: this.model, notice: this.showNotice, t:_t}));

        if (this.model.length){
            this.model.each( function(questionContainer){
                this.$("#question-collection").append(
                    new QuestionContainerView({model : questionContainer}).el);
            }, this)
        }

        return this;
    },

    addOne : function(questionContainer){
        var view = new QuestionContainerView({model : questionContainer});
        this.$("#question-collection").append(view.el);
    },

    onError: function(collection, resp, options){
        //alert("Error: " + resp);
    }
});


/**
 *      view for QuestionContainer
 *      @name QuestionContainerView
 *      @constructor
 *      @augments Backbone.View
 */
var QuestionContainerView = Backbone.View.extend(/** @lends QuestionContainerView.prototype */{
    tagName : 'li',
    attributes: {
        'class':'collabsable'
    },

    initialize : function(){
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model.get('questionList'), 'change', this.render);
        this.listenTo(this.model.get('questionList'), 'add', this.render);
        this.render();
    },

    events:{
        'click a': 'navigate'
    },

    template : _.template($('#template-question-collection-list-item').html()),

    render: function(){
        // check for existing questions in Container
        if (!this.model.current())
            return this;

        this.$el.html(this.template({
            title : this.model.get('title'),
            containerId : this.model.id,
            questionId: this.model.current().id,
        }));

        return this;
    },

    navigate: function(el){
        el.preventDefault();
        var destination = $(el.target).attr('href');
        Backbone.history.navigate(destination, {trigger: true});
        return false;
    }
});


/**
 *      View - QuestionView
 *      @name QuestionView
 *      @constructor
 *      @augments Backbone.View
 */
var QuestionView = Backbone.View.extend(/** @lends QuestionView.prototype */{
    el: "#app",
    template: _.template($('#template-question').html()),

    initialize: function(options){

        this.model = this.collection.get('questionList').get(options.questionId);
        this.render();
    },

    events:{
        'click #nextButton':        'nextQuestion',
        'click #previousButton':    'previousQuestion',
    },

    render: function(){
        if (this.model.hasPrevious())
            var previousId = this.model.previousId();

        if (this.model.hasNext())
            var nextId = this.model.nextId();

        var actualIndex= 0;
        if (this.collection.get('conditionalCase')){
            if(this.model.get('actualIndex') == 0){
                actualIndex=1;
            } else{
                actualIndex= this.model.get('actualIndex');
            }
        }

        this.$el.html(
            this.template({
                questionText: this.model.get('questionText'),
                answerText: this.model.get('answerText'),
                previousId: previousId,
                nextId: nextId,
                number: this.model.get('number'),
                total: this.model.get('total'),
                containerId: this.collection.get('id'),
                lastQuestion: 0,
                actualInd: actualIndex,
            })
        );
        if (this.model.get('type') === "multichoice" &&
            this.model.get('choices')){

            if(this.model.get('multiple_choice') == 1){
                var selectedChoices= this.model.get('answerText');
                var count = 1;
                var that = this;
                var form = $('<form action="">');
                this.$("#answer").append(form);
                _.each(this.model.get('choices'), function(choice){
                    var checkboxInput = $('<input/>');
                    checkboxInput.attr('type', 'checkbox');
                    checkboxInput.attr('name', 'choice');
                    checkboxInput.attr('id', 'checkbox' + count);
                    checkboxInput.attr('value', count);

                    //set the checkboxInput to be selected if selectedChoices contains the current index
                    if (selectedChoices != null){
                        for(var i=0; i<selectedChoices.length; i++){
                            if(selectedChoices[i] == count){
                                checkboxInput.attr('checked','checked');
                            }
                        }
                    }
                    var checkboxLabel = $('<label/>');
                    checkboxLabel.attr('for', 'checkbox' + count);
                    checkboxLabel.text(choice);
                    form.append(checkboxInput);
                    form.append(checkboxLabel);
                    form.append($('<div style="clear: both"></div>'));
                    count++;
                })
            }else{
                var selectedChoice= this.model.get('answerText');
                var count = 1;
                var that = this;
                var form = $('<form action="">');
                this.$("#answer").append(form);
                _.each(this.model.get('choices'), function(choice){
                    var radioInput = $('<input/>');
                    radioInput.attr('type', 'radio');
                    radioInput.attr('name', 'choice');
                    radioInput.attr('id', 'radio' + count);
                    radioInput.attr('value', count);

                    //set the radioInput to be selected if selectedChoice == count
                    if(selectedChoice == count){
                        radioInput.attr('checked','checked');
                    }
                    var radioLabel = $('<label/>');
                    radioLabel.attr('for', 'radio' + count);
                    radioLabel.text(choice);
                    form.append(radioInput);
                    form.append(radioLabel);
                    form.append($('<div style="clear: both"></div>'));
                    count++;
                })
            }
        }
        else{
            var textarea = $('<textarea>')
            if (this.model.get("answerText"))
                    textarea.append(this.model.get("answerText"));
            this.$("#answer").append(textarea);
        }

    },

    nextQuestion: function(el){
        el.preventDefault();
        if (!this.saveValues()) {
            // notify user that he has to choose an answer
            this.$("#answer-feedback").append('<p style="color: red;">'+i18next.t("feedbackTeaser")+'</p>')
            return false;
        }
        // wert speicher

        // this.collection.next muss die abhängigkeit prüfen, ob frage entsprechend beantwortet
        var q = this.collection.next();

        if (!q){
            this.collection.sendData();
            this.undelegateEvents();
            this.$el.html(this.template({lastQuestion:1}));
            if(this.collection.get("feedbackMessage") != ''){
                var feedMsg= this.collection.get("feedbackMessage");
                this.$("#end-message").html(feedMsg);
            }
            else{
                this.$("#end-message").html('<p><i class="fa fa-check"></i>'+i18next.t("messageFinish")+'</p>');
            }
            return false;
        }

        var destination = 'questions/'
            + this.collection.get('id')
            + '/'
            + q.id; //$(el.target).attr('href');
        this.undelegateEvents();
        Backbone.history.navigate(destination, {trigger: true});
        return false;
    },

    previousQuestion: function(el){
        //this.saveValues();
        el.preventDefault();
        var q = this.collection.previous();

        if (!q){
            this.undelegateEvents();
            Backbone.history.navigate('#questions', {trigger: true});
            return false;
        }

        var destination = 'questions/' + this.collection.get('id') + '/' + q.id;
        this.undelegateEvents();
        Backbone.history.navigate(destination, {trigger: true});
        return false;
    },

    saveValues: function(){
        if (this.model.get('type') === "multichoice") {
            var $input= this.$('#answer input[name=choice]:checked');
            if($input.length > 1){
                var choiceNumber= "";
                var choicesText= "";
                $("input[name=choice]:checked").each(function () {
                    var idNum = $(this).val();
                    var checkedText= $('label[for=checkbox'+idNum+']').text();
                    //console.log('current text: '+checkedText);
                    choiceNumber= choiceNumber.concat("|").concat(idNum);
                    choicesText= choicesText.concat("|").concat(checkedText);
                });
                var recordedAnswer= choicesText.substring(1,choicesText.length);
                var choiceNumber= choiceNumber.substring(1,choiceNumber.length)
            }else{
                var choiceNumber= $input.val();
                //console.log('this is the input value: '+choiceNumber);
                var recordedAnswer = $('label[for='+$input.attr('id')+']').text();
            }
            if (typeof recordedAnswer === 'undefined' || !recordedAnswer){
                    return false;
            }
            this.model.set("answerText",choiceNumber);
            //make sure that values are saved on answersHash without trailing line breaks!
            recordedAnswer= recordedAnswer.replace(/^\s+|\s+$/g, '');
             // step by step set the new value for the hash that contains the recorded answers
             //      for all the multiple choice questions in the feedback
             var ansHash= this.collection.get("answersHash");
             ansHash[this.model.get('id')] = recordedAnswer;
             this.collection.set("answersHash",ansHash);
            return this.model.get("answerText");
        } else {
            this.model.set("answerText", this.$('#answer textarea').val());
            return true;
        }
    }
})


/**
 *      vie for the HomeView
 *      @name HomeView
 *      @constructor
 *      @augments Backbone.View
 */
 HomeView = Backbone.View.extend(/** @lends HomeView.prototype */{
    el : "#app",
    template : _.template($('#template-home-screen').html()),
    /** @type {Configuration} */
    model: Configuration,

    events: {
        'click .footerlink': 'impressum'
    },

    initialize : function() {
        this.model = new Configuration({id:1});;
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

        this.AppointmentListView = new AppointmentListView({
            el : '#dates',
            model : Appointments,
            limit : 3
        });

        this.QuestionCollectionListView = new QuestionCollectionListView({
            el: '#questions',
            model: Questions,
            showNotice: true
        });

        return this;
    }
});


/**
 *		View - InitialSetupView
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
	model: Configuration,

    initialize: function(){
        this.model= new Configuration({id:1});
        this.collection = new TabCollection();
        var that = this;
        var onDataHandler = function(collection, response, options) {
            console.log('configuration object fetched from server');
            that.render();
        };

        var onErrorHandler = function(collection, response, options) {
            that.collection.url = 'js/config.json';
            console.log(that.collection);
            that.model.set('contactsURL','js/config.json');
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
		var ID= element.attr('id');
		//retrieve the parameters to be stored in Config model
		var paramsOBJ= this.collection.get(ID);
		this.model.set('accessToken',paramsOBJ.get('accessToken'));
		this.model.set('moodleServiceEndpoint',paramsOBJ.get('moodleServiceEndpoint'));
		this.model.set('moodleLoginEndpoint',paramsOBJ.get('moodleLoginEndpoint'));
        this.model.set('impressumTemplate',paramsOBJ.get('impressumTemplate'));
        this.model.set('uniLogoPath',paramsOBJ.get('uniLogoPath'));
        this.model.set('courseID',paramsOBJ.get('courseID'));
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



/**
 *      View - ConfigView
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
    model: Configuration,

    initialize: function(){
        this.model = new Configuration({id:1});
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
            PushServiceRegister(this.model.get('courseID'));
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


/**
 *      ImpressumView
 *      @name ImpressumView
 *      @constructor
 *      @augments Backbone.View
 */
var ImpressumView = Backbone.View.extend(/** @lends ImpressumView.prototype */{
    configCase : false,
    el: '#app',
    template: _.template($('#template-impressum').html()),

    initialize: function(options){
        if("caseConfig" in options){
            this.configCase = true;
        }
        this.render();
    },

    render: function(){
        if(!this.configCase){
            this.$el.html(this.template({caseConfiguration : false}));
        }
        else{
            this.$el.html(this.template({caseConfiguration : true}));
        }
        // fill the emptied template with the contents of Configuration´s
        //      'impressumTemplate' attribute
        Config= new Configuration({id:1});
        Config.fetch();
        var htmlString= Config.get('impressumTemplate');
        this.$("#impressum-html-content").append(htmlString);
        // alternatively, load the logo of the University and display it
        //      at the end of the document
        //var logoPath= Config.get('uniLogoPath');
        //if(logoPath != ''){
        //    var imgTag = $('<img alt="university_logo">');
        //    imgTag.attr('src',logoPath);
        //    this.$("#logo-container").append(imgTag);
        //    return this;
        //}
    }
});


/**
 *      FeedbackView
 *      @name FeedbackView
 *      @constructor
 *      @augments Backbone.View
 */
var FeedbackView = Backbone.View.extend(/** @lends FeedbackView.prototype */{
    el: '#app',
    template: _.template($('#template-feedback').html()),

    events: {
        'click #submitButton': 'submit',
        'click #back_button' : 'back'
    },

    initialize: function() {
        this.model = Config;
        this.listenTo(this, 'errorHandler', this.errorHandler);
        this.listenTo(this, 'successHandler', this.enrolUser);
    },

    render: function() {
        this.$el.html(this.template({t:_t}));
        return this;
    },

    errorHandler: function(error) {
        console.log("had error");
    },

    successHandler: function() {
        console.log("success");
    },

    submit: function(ev) {
        ev.preventDefault();
        var feedbacktext = $('#feedbacktext').val();
        feedbacktext = $('<div />').text(feedbacktext).html();
        var that = this;
        $.ajax({
            url: that.model.get('moodleServiceEndpoint'),
            data: {
                wstoken: that.model.get("moodleAccessToken"),
                wsfunction: "local_reflect_post_feedback",
                moodlewsrestformat: "json",
                feedback: feedbacktext,
                courseID: that.model.get('courseID')
            },
            headers: that.model.get("accessToken")
        }).done(function(data){
            if (data.error){
                that.trigger('errorHandler');
            }else{
                that.undelegateEvents();
                Backbone.history.navigate("feedbackresult", {trigger: true});
            }
        }).error(function(xhr, status, error){
            console.log(xhr.responseText);
            console.log(status);
            console.log(error);
            that.trigger('errorHandler');
        });
    },

    back: function(){
        this.undelegateEvents();
    }

});


/**
 *      FeedbackResultView
 *      @name FeedbackResultView
 *      @constructor
 *      @augments Backbone.View
 */
var FeedbackResultView = Backbone.View.extend(/** @lends FeedbackResultView.prototype */{
    el: '#app',
    template: _.template($('#template-feedbackresult').html()),

    render: function() {
        this.$el.html(this.template());
        return this;
    }
});


/**
 *      AppointmentsView
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
            model: Appointments,
            showButton : false,
        });
        return this;
    }
});


/**
 *      QuestionsView
 *      @name QuestionsView
 *      @constructor
 *      @augments Backbone.View
 */
var QuestionsView = Backbone.View.extend(/** @lends QuestionsView.prototype */{
    el: '#app',
    template: _.template($('#template-questions-screen').html()),
    /** @type {Configuration} */
    model: Configuration,

    initialize: function(){
        this.model = Config;
        this.authorize();
    },

    authorize: function(){
        this.model.fetch();
        var token = this.model.get("accessToken");
        if (token == ""){
            Backbone.history.navigate('config', { trigger : true });
        }else{
            this.render();
        }
    },

    render: function(){
        this.$el.html(this.template({t: _t}));
        this.QuestionCollectionListView = new QuestionCollectionListView({
            el: '#questions',
            model: Questions
        });
        return this;
    }
});


/**
 *      ContactPersonsView
 *      @name ContactPersonsView
 *      @constructor
 *      @augments Backbone.View
 */
var ContactPersonsView = Backbone.View.extend(/** @lends ContactPersonsView.prototype */{
    el: '#app',
    template: _.template($('#template-contact-persons').html()),
    events: {
        "click a.external": "openExternal"
    },

    initialize: function() {

        this.collection = new ContactPersonCollection();
        var that= this;
        var Config= new Configuration({id:1});
        Config.fetch();
        this.collection.url= Config.get('contactsURL');
        this.collection.fetch({
            headers: {'Authorization' :'Bearer 732c17bd-1e57-3e90-bfa7-118ce58879e8'},
            success: function () {
                that.render();
            },
            error: function() {
                that.collection.fetch().done(function(){
                    that.render();
                });
            }
        });
        this.listenTo(this.collection, "sync", this.render);  
    },

    openExternal: function(event) {
        var url = $(event.currentTarget).attr("href");

        if (window.cordova) {
            console.log("Opening " + url + " in system");
            window.open(url, "_system");
            return false;
        }
    },

    render: function() {
        this.undelegateEvents();
        // parsing method of the obtained collection of contacts is going to be different if the json object
        //  is provided from a general config.json file (a third level of parsing is needed + only the
        //  corresponding contact persons page to the recorded course ID is to be loaded)
        var Config= new Configuration({id:1});
        Config.fetch();
        var cID= Config.get('courseID');
        this.$el.html(this.template({contacts: this.collection, t:_t, courseID: cID}));
        // Accordion Logic
        var acc = document.getElementsByClassName("accordion");
        var i;

        for (i = 0; i < acc.length; i++) {
            acc[i].onclick = function(){
                this.classList.toggle("active");
                this.nextElementSibling.classList.toggle("show");
            }
        }

        this.delegateEvents();
        return this;
    }
});


/**
 *      LogoutView
 *      @name LogoutView
 *      @constructor
 *      @augments Backbone.View
 */
var LogoutView = Backbone.View.extend(/** @lends LogoutView.prototype */{
    el: '#app',

    initialize: function() {
		this.model= new Configuration({id:1});
        this.model.fetch();
        this.model.destroy({
            success: this.reroute,
            error: this.retryDestroy
        });
        // unsubscribe from push notification service
        UnsubscribeToUniqush();
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


/*
 *      LanguagesPageView
 *      @name LanguagesPageView
 *      @constructor
 *      @augments Backbone.View
 */
var LanguagesPageView = Backbone.View.extend(/** @lends LanguagesPageView.prototype */{
    initialSetupCase: false,
    el: '#app',
    template: _.template($('#template-languages-selection').html()),
    events: {
        "click #changeButton": "changeLanguage"
    },

    initialize: function(options) {
        this.model= new Configuration({id:1});
        if ("caseInit" in options){
            this.initialSetupCase= true;
        }
        this.render();
    },

    changeLanguage: function(){
        this.model.fetch();
        //get the new selected language
        var selected_language= $("#language-select option:selected").val();
        //if selected language is the current one, no change is necessary
        if(selected_language == this.model.get('appLanguage')){
            if (this.initialSetupCase){
                this.initialSetupCase = false;
                Backbone.history.navigate('initialSetup', { trigger : true });
            }else{
                Backbone.history.navigate('', { trigger : true });
            }
        }
        //else, apply the changes
        this.model.set('appLanguage',selected_language);
        this.model.save();
        i18next.changeLanguage(selected_language);
        console.log("i18next language has been set to: "+selected_language);
        //menu and infopanel have to be newly rendered to the selected language
        $('#panel-menu').text(i18next.t("panelMenu"));
        $('#more-appointments-button').text(i18next.t("panelAppointments"));
        $('#more-questions-button').text(i18next.t("panelQuestions"));
        $('#panel-contact-persons').text(i18next.t("panelContact"));
        $('#panel-feedback').text(i18next.t("panelFeedback"));
        $('#panel-languages').text(i18next.t("panelLanguages"));
        $('#panel-home').text(i18next.t("panelHome"));
        $('#panel-logout').text(i18next.t("panelLogout"));
        $('#infopanel-content').html(i18next.t("infoMessage_1"));
        //navigate to home
        if (this.initialSetupCase){
            this.initialSetupCase = false;
            this.undelegateEvents();
            Backbone.history.navigate('initialSetup', { trigger : true });
        }else{
            this.undelegateEvents();
            Backbone.history.navigate('', { trigger : true });
        }
    },

    render: function(){
        this.model.fetch();
        var current_language= this.model.get('appLanguage');
        var preSelectedLang= 0;
        if(current_language == 'en')preSelectedLang= 1;
        else if(current_language == 'es')preSelectedLang= 2;
        if(!this.initialSetupCase){
            this.$el.html(this.template({t: _t, caseInit: false, selectedLang : preSelectedLang}));
            return this;
        }else {
            this.$el.html(this.template({t: _t, caseInit: true, selectedLang : preSelectedLang}));
            //this.initialSetupCase= false;
            return this;
        }
    }
});



/**
 *      @name Router
 *      @constructor
 *      @augments Backbone.Router
 */
var Router = Backbone.Router.extend(/** @lends Router.prototype */{
    model : Configuration,
    routes : {
        '' : 'home',
		'initialSetup' : 'initialSetup',
        'config': 'config',
        'appointments' : 'appointments',
        'questions': 'questions',
        'questions/:containerId/:questionId' : 'question',
        'impressum': 'impressum',
        'feedback': 'feedback',
        'feedbackresult' : 'feedbackresult',
        'contactpersons': 'contactpersons',
        'languages' : 'languages',
        'logout': 'logout',
        'languagesInit': 'languagesInit',
        'impressumConfig' : 'impressumConfig'
    },

    switchView : function(view){
        // check authorization if not valid dont show sidepanel
        this.model = new Configuration({id:1});
        this.model.fetch();
        var token = this.model.get("moodleAccessToken");
        if (token == ""){
            if(document.getElementById("panel")){
                document.getElementById("panel").style.display = "none";
            }
        }else{
            if(document.getElementById("panel")){
                document.getElementById("panel").style.display = "block";
            }
        }

        // prepare infopanel
        if(document.getElementById("infopanel")){
            document.getElementById("infopanel").style.display = "none";
        }
        //console.log(this.view);
        if (this.view){
            // COMPLETELY UNBIND THE VIEW
            //this.view.undelegateEvents();
            //this.view.$el.removeData().unbind();
            // Remove view from DOM
            //this.view.remove();
            //Backbone.View.prototype.remove.call(this.view);

            this.view = null;
        }
        this.view = view;
        this.view.render();
    },

    home : function(){
        this.switchView(new HomeView());
    },

	initialSetup : function(){
		this.switchView(new InitialSetupView());
	},

    config: function(){
        this.switchView(new ConfigView());
    },

    appointments: function(){
        this.switchView(new AppointmentsView())
    },

    questions: function(){
        this.switchView(new QuestionsView());
        document.getElementById("infopanel").style.display = "block";
    },

    question: function(containerId, questionId){
        var questionContainer = Questions.get(containerId);
        this.switchView(new QuestionView({collection: questionContainer, questionId: questionId}));
    },

    impressum: function(){
        this.switchView(new ImpressumView({}))
    },

    feedback: function() {
        this.switchView(new FeedbackView())
    },

    feedbackresult : function() {
        this.switchView(new FeedbackResultView())
    },

    contactpersons: function() {
        this.switchView(new ContactPersonsView())
    },

    languages: function() {
        this.switchView(new LanguagesPageView({}))
    },

    logout: function() {
        this.switchView(new LogoutView())
    },

    languagesInit: function() {
        this.switchView(new LanguagesPageView({caseInit: 1}))
    },

    impressumConfig: function() {
        this.switchView(new ImpressumView({caseConfig: 1}));
    }

});
