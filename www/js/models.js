var app = (app || {} );


/**
 *      Model - Configuration
 */
var Configuration = Backbone.Model.extend({
    // necessary local storage declaration to save a single model; in this case
    // the Configuration model that holds the list of removed appointment titles.
    localStorage : new Store("Configuration"),
    defaults:{
        accessToken: '',
		notificationsCounter: 0,
		notificationsList: '{"titlesToNotify" : []}',
        appointmentList: '{"removedTitles" : []}',
    }
});


/**
 *      Model - Appointment
 */
var Appointment = Backbone.Model.extend({
    // the visible attribute of this model defines if the appointment is visible from
    // the start page of the application.
	defaults:{
		title : 'Appointment Title',
        begin : new Date(),
        end : new Date(),
		toNotify: false,
        visible: true,
	}
});


/**
 *      Model - Feedback
 */
var Feedback = Backbone.Model.extend({
	defaults:{
                feedbackText : null,
	}
});


/**
 *      Model - Question
 */
var Question = Backbone.Model.extend({
    defaults: {
        questionText: 'Question Text',
        number: null,
        total: null,
        answerText : null,
        choices: null
    },

    hasPrevious: function(){
        if (this.collection.indexOf(this) == 0){
            return false;
        }else{
            return true;
        }
    },

    hasNext: function(){
        if (this.collection.indexOf(this) == this.collection.length - 1){
            return false;
        }else{
            return true;
        }
    },

    nextId: function(){
        if (!this.hasNext())
            return;

        return this.collection.at(this.collection.indexOf(this)+1).id;
    },

    previousId: function(){
        if (!this.hasPrevious())
            return;

        return this.collection.at(this.collection.indexOf(this)-1).id;
    }
});


/**
 *      Collection - QuestionList
 */
var QuestionList = Backbone.Collection.extend({
    model: Question
});


/**
 *      Model - QuestionContainer
 */
var QuestionContainer = Backbone.Model.extend({

    defaults: {
        title : 'Questions',
        currentIndex: 0,
        firstQuestion: null,
        questionList: QuestionList,
    },

    initialize: function(){
        this.set('questionList', new QuestionList());
    },

    next: function(){
        if (this.get('currentIndex') == this.length - 1)
            return null;

        this.set('currentIndex', this.get('currentIndex') + 1);
        return this.current();
    },

    previous: function(){
        if (this.get('currentIndex') <= 0)
            return null;

        this.set('currentIndex', this.get('currentIndex') - 1);
        return this.current();
    },

    current: function(){
        return this.get('questionList').at(this.get('currentIndex'));
    },

    add: function(element){
        return this.get('questionList').add(element);
    },

    getQuestion: function(id){
        return this.get('questionList').get(id);
    },

    sendData: function(){
        var result = {id: this.id};
        result.answers = new Array();
        _.each(this.get('questionList').models, function(question){
            result.answers.push({
                id: question.id,
                answer: question.get("answerText")
            })
        });

        var token = Config.get("accessToken");

        $.ajax({
            url: moodleServiceEndpoint,
            data: {
                wstoken: token,
                wsfunction: "local_reflect_submit_feedbacks",
                moodlewsrestformat: "json",
                id: result.id,
                answers: result.answers
            },
            headers: accessToken
        }).done(function(data) {
            console.log(data);
        });
    }
});


/**
 *      Collection - QuestionContainerList
 *      ToDo: Triggered twice
 */
var QuestionContainerList = Backbone.Collection.extend({

    model : QuestionContainer,

    sync: function(method, model, options){

        var token = Config.get("accessToken");

        $.ajax({
            url: moodleServiceEndpoint,
            data: {
                wstoken: token,
                wsfunction: "local_reflect_get_feedbacks",
                moodlewsrestformat: "json",
            },
            headers: accessToken
        })

        .done(function(data) {
            //console.log(data);
            if (data.message) {
                if (options && options.error)
                    options.error(data.message);

                //return;
            }

            if (options && options.success)
                if (!data.feedbacks || data.feedbacks.length == 0){
                        options.success([]);
                        return;
                }

                var result = new Array();

                _.each(data.feedbacks, function(item){

                    var questionContainer = new QuestionContainer({
                        id: item.id,
                        title: item.name
                    });

                    _.each(item.questions, function(question, i){

                        var q = new Question({
                            id: question.id,
                            number: i+1,
                            total: item.questions.length,
                            questionText: question.questionText,
                            type: question.type,
                        });

                        if (question.choices) {
                            q.set("choices", question.choices.substring(6).split('|'));
                        }

                        questionContainer.get('questionList').add(q);

                    });

                    result.push(questionContainer);
                });

                options.success(result);
        });

    }
});


/**
 *      Collection - AppointmentCollection
 */
var AppointmentCollection = Backbone.Collection.extend({

	model : Appointment,

    sync: function(method, model, options){

        var today = new Date();
        var oneYearLater = new Date();
        oneYearLater.setFullYear(today.getFullYear()+1);
        var token = Config.get("accessToken");
        //console.log(token);
        $.ajax({
            url: moodleServiceEndpoint,
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
                }
            },
            headers: accessToken
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
					//check if the model to be added is listed in the list of appointments to notify,
					//in that case, the model's attribute toNotify is set to be true
					var notifyListSTR= Config.get('notificationsList');
					var notifyListOBJ= window.JSON.parse(notifyListSTR);
					var numElements= notifyListOBJ.titlesToNotify.length;
					var notifyable= 0;
					for(var s=0; s<numElements; s++){
						var appointmentsTitle= notifyListOBJ.titlesToNotify[s];
						if(appointmentsTitle == item.name){
							notifyable= 1;
							break;
						}
					}
					if(notifyable == 1){
						toNotify= true;
					}
					else{
						toNotify= false;
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
                        if(appointmentModelsTitle == item.name){
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
                        title: item.name,
                        description: item.description,
                        begin : new Date(item.timestart * 1000),
                        end: new Date((item.timestart + item.timeduration)*1000),
						toNotify: toNotify,
                        visible : visible
                    }));
                });
                options.success(result);
        });

    }
});


/**
 *      Model - Screen
 */
var Screen = Backbone.Model.extend({
    defaults : {
        title : "Screen title",
        content : "",
    },
});


/**
  * NestedModel - Parses defined properties as Backbone classes
  * Code taken from http://stackoverflow.com/questions/6535948/nested-models-in-backbone-js-how-to-approach
  */
var NestedModel = Backbone.Model.extend({
    model: {},

    parse: function(response) {
        for (var key in this.model) {
            var EmbeddedClass = this.model[key];
            var embeddedData = response[key];
            response[key] = new EmbeddedClass(embeddedData, {parse: true});
        }
        return response;
    }
});


/**
 * ContactPersonCollection - Contact list with two category levels.
 * See https://eportfolio.uni-potsdam.de/moodle/pluginfile.php/568/mod_folder/content/0/Ansprechpartner%20Studienstart_WiSo_F%C3%A4cher.pdf?forcedownload=1 for data visualisation.
 *
 * JSON structure:
 * [{
 *   category: ...,
 *   content: [{
 *     category: <optional>,
 *     content: [{
 *       name: <optional>,
 *       comment: <optional>,
 *       location: <optional>,
 *       tel: <optional>,
 *       alt_tel: <optional>,
 *       secretary: <optional>,
 *       mail: <optional>,
 *       consultation: <optional>,
 *       consultation_url: <optional>
 *     }]
 *   }]
 * }]
 */
var ContactPersonCollection = Backbone.Collection.extend({
    url: 'contactpersons.json',
    model: NestedModel.extend({
        model: {
            content: Backbone.Collection.extend({
                model: NestedModel.extend({
                    model: {
                        content: Backbone.Collection.extend({
                            model: Backbone.Model.extend({
                                parse: function(response) {
                                    var formatTel = function(tel) {
                                        return tel.replace(/\+/g, "00")
                                                .replace(/\s/g, "")
                                                .replace(/\-/g, "");
                                    };

                                    var telLink = response.tel ? formatTel(response.tel) : undefined;
                                    var alt_telLink = response.alt_tel ? formatTel(response.alt_tel) : undefined;
                                    var secretary_telLink = response.secretary ? formatTel(response.secretary) : undefined;

                                    return _.extend(response, {
                                        telLink: telLink,
                                        alt_telLink: alt_telLink,
                                        secretary_telLink: secretary_telLink
                                    });
                                }
                            })
                        })
                    }
                })
            })
        }
    })
});