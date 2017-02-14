/**
 *      Views - Views for Appointments
 *      View - AppointmentListItemView
 */
var AppointmentListItemView = Backbone.View.extend({
    tagName : 'li',

    initialize : function(options){
        if("fullView" in options)
            this.fullView = options.fullView;

        this.listenTo(this.model, 'change', this.render);
        this.render();
    },

    template : _.template($('#template-appointment-list-item').html()),

    events: {
        'click #notificationButton':'notifyButtonFunction',
        'click' : 'toggle',
        'click .data':'hideButtonFunction',
        'webkitAnimationEnd' : 'toggleAppointment',
        'mozAnimationEnd' : 'toggleAppointment',
        'MSAnimationEnd' : 'toggleAppointment',
        'animationend' : 'toggleAppointment',
    },

    toggle: function(){
        this.$el.find('.subdescription').toggleClass("expand");
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
			notiListOBJ.titlesToNotify.push(appointmentTitle);
			notiListSTR = window.JSON.stringify(notiListOBJ);
			Config.set('notificationsList', notiListSTR);
			Config.save();
		}
	},
	
	displayAlert : function(){
		navigator.notification.alert(
			'Du wirst eine Benachrichtigung bekommen.',  // message
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
		var hoursToBegin= (beginDate - currTime) / 3600000;
		var self= this;
        document.addEventListener('deviceready',function(){
			// manage three different cases depending on the amount of time before the beginning of the appointment
			//		case 1: more than 7 days => the user gets a notification one week before and the day before
			//		case 2: more than 1 day but less than 7 days => the user gets a notification 24 hours before the appointment
			//		case 3: less than 24 hours but more than 3 hours => the user gets a notification three hours before the appointment
			if(hoursToBegin > 168){
				// form notification message to get a reminder one week before
				var notificationMessage = "Du hast einen Termin am: "+beginDate.getDate()+"."+('0'+(beginDate.getMonth()+1)).slice(-2);
				if(beginDate.getTime != beginDate.getTime){
					notificationMessage = notificationMessage.concat(" um "+("0"+beginDate.getHours()).slice(-2)+":"+("0"+beginDate.getMinutes()).slice(-2)+" Uhr");
				}else{
					notificationMessage = notificationMessage.concat("."); 
				}
				// calculate the value for the time one week before the appointment
				var notificationTime= beginDate - 604800000;
				// only for debugging: a couple of delayed times in 30 and 50 seconds
				//var _15_sec_after= new Date(currTime.getTime() + 15*1000);
				//var _30_sec_after= new Date(currTime.getTime() + 30*1000);
				notiCounter++;
				self.scheduleNotification(notiCounter,appointmentTitle,notificationMessage,notificationTime,0);
				// form notification message to get a reminder the day before				
				notificationMessage = "Du hast morgen einen Termin";
				if(beginDate.getTime != beginDate.getTime){
					notificationMessage = notificationMessage.concat(" um "+("0"+beginDate.getHours()).slice(-2)+":"+("0"+beginDate.getMinutes()).slice(-2)+" Uhr");
				}else{
					notificationMessage = notificationMessage.concat("."); 
				}
				// calculate the value for the time one day before the appointment
				notificationTime = beginDate - 86400000;
				notiCounter++;
				self.scheduleNotification(notiCounter,appointmentTitle,notificationMessage,notificationTime,1);
				self.displayAlert();
			}
			if(hoursToBegin < 168 && hoursToBegin > 24){
				// form notification message to get a reminder the day before				
				var notificationMessage = "Du hast morgen einen Termin";
				if(beginDate.getTime != beginDate.getTime){
					notificationMessage = notificationMessage.concat(" um "+("0"+beginDate.getHours()).slice(-2)+":"+("0"+beginDate.getMinutes()).slice(-2)+" Uhr");
				}else{
					notificationMessage = notificationMessage.concat("."); 
				}
				// calculate the value for the time one day before the appointment
				var notificationTime = beginDate - 86400000;
				notiCounter++;
				self.scheduleNotification(notiCounter,appointmentTitle,notificationMessage,notificationTime,1);
				displayAlert();
			}
			if(hoursToBegin < 24 && hoursToBegin > 3){
				// form notification message to get a reminder three hours before the appointment
				var notificationMessage = "Termin"
				if(beginDate.getTime != beginDate.getTime){
					notificationMessage= notificationMessage.concat(" um: "+("0"+beginDate.getHours()).slice(-2)+":"+("0"+beginDate.getMinutes()).slice(-2)+" Uhr nicht vergessen!");
				}else{
					notificationMessage= notificationMessage.concat(" nicht vergessen!");
				}
				// calculate the value for the time three hours before the appointment
				var notificationTime = beginDate - 10800000;
				notiCounter++;
				self.scheduleNotification(notiCounter,appointmentTitle,notificationMessage,notificationTime,1);
				displayAlert();
			}
			// NOTE: it is up to the user to delete the notifications from the notification center once they have been triggered
         }); // on device ready
		 // change parameter toNotify in model to set the Bell icon
		this.model.set('toNotify',true);
    },
	
    hideButtonFunction : function(ev) {

        // get appointment list and current clicked appointment
        var currTitle= this.model.get('title');

        Config.fetch();
        var apListSTR = Config.get('appointmentList');
        var apListOBJ = window.JSON.parse(apListSTR);

        //add class that triggers an animation on the appointment
        this.$el.addClass('out');

        if (this.$el.hasClass('darkClass')){
            // remove appointment from appointment list
            var index = _.indexOf(apListOBJ.removedTitles, currTitle);
            apListOBJ.removedTitles.splice(index, 1);
        }else{
            // add appointment to appointment list
            apListOBJ.removedTitles.push(currTitle);
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
 *      View - AppointmentListView
 */
var AppointmentListView = Backbone.View.extend({
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
 *      Views - Views for Questions
 *      View - QuestionCollectionListView
 */
var QuestionCollectionListView = Backbone.View.extend({
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
 *      View - QuestionContainerView
 */
var QuestionContainerView = Backbone.View.extend({
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
 */
var QuestionView = Backbone.View.extend({
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
            })
        );
        if (this.model.get('type') === "multichoice" &&
            this.model.get('choices')){
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

                //set the radioImput to be selected if selectedChoice == count
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
                // custom feedback message at the end of quizz might be provided in several different languages
                //      therefore, the message in the preferred language must be extracted
                var feedMsg= this.collection.get("feedbackMessage");
                var matchPattern= /<span lang=/i;
                var found= feedMsg.search(matchPattern);
                //form the name of the enclosing tags
                var Config= new Configuration({id:1});
                Config.fetch();
                var language= Config.get('appLanguage');
                var openTag= '<span lang="'+language+'" class="multilang">';
                var closeTag= '</span>';
                if(found != -1){
                    //extract text in the correct language
                    var results= feedMsg.match(new RegExp(openTag + "(.*)" + closeTag));
                    //if the preferred language was not found, rollback to german
                    if(results == null){
                        var openTag_2= '<span lang="de" class="multilang">';
                        results= feedMsg.match(new RegExp(openTag_2 + "(.*)" + closeTag));
                    }
                    feedMsg= results[1];
                    //introduce a correction in case more information than needed was extracted
                    found= feedMsg.search(matchPattern);
                    while (found != -1){
                        results= feedMsg.match(new RegExp("(.*)"+closeTag+".*"));
                        feedMsg= results[1];
                        found= feedMsg.search(matchPattern);
                    }
                }
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

        var destination = 'questions/'
            + this.collection.get('id')
            + '/'
            + q.id;
        this.undelegateEvents();
        Backbone.history.navigate(destination, {trigger: true});
        return false;
    },

    saveValues: function(){
        if (this.model.get('type') === "multichoice") {
            var $input= this.$('#answer input[name=choice]:checked');
            var choiceNumber= $input.val();
            var recordedAnswer = $('label[for='+$input.attr('id')+']').text();
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
 *      Views - Main Site Views
 *      View - HomeView
 */
var HomeView = Backbone.View.extend({
    el : "#app",
    template : _.template($('#template-home-screen').html()),
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
                moodlewsrestformat: "json"
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
 */
var InitialSetupView = Backbone.View.extend({
	el: '#app',
	template: _.template($('#template-initial-setup').html()),
	events: {
		'click .courseTab' : 'writeConfigAttributes',
	},
	model: Configuration,
	
    initialize: function(){    
		this.model= new Configuration({id:1});
		this.collection = new TabCollection();
		this.collection.fetch();
		this.listenTo(this.collection, "sync", this.render);
		
            this.listenTo(this.collection, "error", this.fetchError);
    },

    render: function(){
		//console.log(this.collection);
        this.$el.html(this.template({tabs: this.collection, t:_t}));
        return this;
    },
	
	fetchError: function(err, param) {
            console.log('Error loading Opening-JSON file', err, param);
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
		// save model to local storage
		this.model.save();
		// navigate to the normal login page
		Backbone.history.navigate('config', { trigger : true });
	}
});
	
	

/**
 *      View - ConfigView
 */
var ConfigView = Backbone.View.extend({
    el: '#app',

    template: _.template($('#template-config-screen').html()),
    events: {
        'submit #loginform': 'submit'
    },

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
		//console.log('Login - token stored in local memory within Config model: '+window.JSON.stringify(this.model.get("accessToken")));
        $.ajax({
            url: that.model.get("moodleLoginEndpoint"),
            data: {
                username: username,
                password: password,
                service: 'reflect'
            },
            headers: that.model.get("accessToken")
        }).done(function(data){
            console.log(data);
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
        var that = this;
        $.ajax({
            url: that.model.get('moodleServiceEndpoint'),
            data: {
                wstoken: that.model.get("accessToken"),
                wsfunction: "local_reflect_enrol_self",
                moodlewsrestformat: "json"
            },
            headers: that.model.get("accessToken")
        }).done(function(data){
            if (data.error){
                that.trigger('errorHandler');
            }else{
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

    render: function(){
		//call tab view
        this.$el.html(this.template({t: _t}));
        return this;
    }
});


/**
 *      View - ImpressumView
 */
var ImpressumView = Backbone.View.extend({
    el: '#app',
    template: _.template($('#template-impressum').html()),

    initialize: function(){
        this.render();
    },

    render: function(){
        this.$el.html(this.template());
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
 *      View - FeedbackView
 */
var FeedbackView = Backbone.View.extend({
    el: '#app',
    template: _.template($('#template-feedback').html()),

    events: {
        'submit': 'submit'
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
        var that = this;
        $.ajax({
            url: that.model.get('moodleServiceEndpoint'),
            data: {
                wstoken: that.model.get("accessToken"),
                wsfunction: "local_reflect_post_feedback",
                moodlewsrestformat: "json",
                feedback: feedbacktext
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
    }
});


/**
 *      View - FeedbackResultView
 */
var FeedbackResultView = Backbone.View.extend({
    el: '#app',
    template: _.template($('#template-feedbackresult').html()),

    render: function() {
        this.$el.html(this.template());
        return this;
    }
});


/**
 *      View - AppointmentsView
 */
var AppointmentsView = Backbone.View.extend({
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
 *      View - QuestionsView
 *      view for all questions
 */
var QuestionsView = Backbone.View.extend({
    el: '#app',
    template: _.template($('#template-questions-screen').html()),
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
 *      View - ContactPersonsView
 *      view for all contact persons
 */
var ContactPersonsView = Backbone.View.extend({
    el: '#app',
    template: _.template($('#template-contact-persons').html()),
    events: {
        "click a.external": "openExternal"
    },

    initialize: function() {
        this.collection = new ContactPersonCollection();
        this.listenTo(this.collection, "sync error", this.render);

        this.render();
        this.collection.fetch();
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
        this.$el.html(this.template({contacts: this.collection, t:_t}));

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
 *      View - LogoutView
 */
var LogoutView = Backbone.View.extend({
    el: '#app',

    initialize: function() {
		this.model= new Configuration({id:1});
        this.model.destroy({
            success: this.reroute,
            error: this.reroute
        });
    },

    reroute: function() {
        Backbone.history.navigate('initialSetup', {trigger: true});
    }
});


/*
 *      View - LanguagesPageView
 */
var LanguagesPageView = Backbone.View.extend({
    el: '#app',
    template: _.template($('#template-languages-selection').html()),
    events: {
        "click #changeButton": "changeLanguage"
    },

    initialize: function() {
        this.model= new Configuration({id:1});
        this.render();
    },

    changeLanguage: function(){
        this.model.fetch();
        //get the new selected language
        var selected_language= $("#language-select option:selected").val();
        //if selected language is the current one, no change is necessary
        if(selected_language == this.model.get('appLanguage')) Backbone.history.navigate('', { trigger : true });
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
        Backbone.history.navigate('', { trigger : true });
    },

    render: function(){
        this.$el.html(this.template({t: _t}));
        return this;
    }
});



/**
 *  Routes
 */
var Router = Backbone.Router.extend({
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
        'logout': 'logout'
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
        if (this.view){
            if (this.view.destroy)
                this.view.destroy();

            this.view = null;
        }
        this.view = view;
        this.view.render();
    },

    home : function(){
        this.switchView(new HomeView());
    },
	
	initialSetup : function(){
		this.switchView(new InitialSetupView);
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
        this.switchView(new ImpressumView())
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
        this.switchView(new LanguagesPageView())
    },

    logout: function() {
        this.switchView(new LogoutView())
    }
});
