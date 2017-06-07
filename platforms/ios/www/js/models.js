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
    }
});

var Tab = Backbone.Model.extend({
});

var TabCollection = Backbone.Collection.extend({
	model: Tab,
	url: 'js/config.json',
});


/**
 *      Model - Appointment
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
        dependItem : null,      // model needs 'dependItem' and 'dependValue' attributes
        dependValue : null,     //      to support conditional questions on feedbacks
        answerText : null,
        choices: null,
        actualIndex: 0,
        label: null,            // label is necessary to implement both types of multi-choice questions
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
        feedbackMessage: '',
        answersHash: {},
        actualPath: [],
        conditionalCase: false,
    },

    initialize: function(){
        this.set('questionList', new QuestionList());
    },

    next: function(){
        if (this.get('currentIndex') == this.get("questionList").length - 1)
            return null;
        var listLength= this.get("questionList").length;
        // push current index into the actualPath
        var answeredPath= this.get('actualPath');
        answeredPath.push(this.get('currentIndex'));
        var nextOnSequence = this.get('questionList').at(this.get('currentIndex') + 1);
        this.set('currentIndex', this.get('currentIndex') + 1);
        // if dependItem is different to 0 it means that the question has a dependency
        if(nextOnSequence.get("dependItem") != 0){
            // if the dependency of the next question in the row is satisfied, then
            //      it is selected to be the next question
            while (nextOnSequence.get("dependValue") != this.get("answersHash")[nextOnSequence.get("dependItem")] && nextOnSequence.get("dependItem") != 0){
                if (this.get('currentIndex') == listLength - 1)
                    return null;
                this.set('currentIndex', this.get('currentIndex') + 1);
                nextOnSequence = this.get('questionList').at(this.get('currentIndex'));
                nextOnSequence.set('actualIndex',answeredPath.length + 1);
            }
            return this.current();
        }
        nextOnSequence.set('actualIndex',answeredPath.length + 1);
        return this.current();
    },

    previous: function(){
        if (this.get('currentIndex') <= 0)
            return null;
        // pop previous index from actualPath to know which was the last answered question
        var answeredPath= this.get('actualPath');
        var lastIndex= answeredPath.pop();
        this.set('currentIndex', lastIndex);
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
		var Config= new Configuration({id:1});
		Config.fetch();
        var token = Config.get("moodleAccessToken");
        $.ajax({
            url: Config.get('moodleServiceEndpoint'),
            data: {
                wstoken: token,
                wsfunction: "local_reflect_submit_feedbacks",
                moodlewsrestformat: "json",
                id: result.id,
                answers: result.answers,
                courseID : Config.get('courseID')
            },
            headers: Config.get('accessToken')
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

    processMoodleContents: function(language, stringToAnalize){
        //checking for multi language tags
        var matchPattern= /<span lang=/i;
        var found= stringToAnalize.search(matchPattern);
        //form the name of the enclosing tags
        var openTag= '<span lang="'+language+'" class="multilang">';
        var closeTag= '</span>';
        if(found != -1){
            //extract text in the correct language
            var results= stringToAnalize.match(new RegExp(openTag + "(.*?)" + closeTag));
            //if the preferred language was not found, rollback to german
            if(results == null){
                var openTag_2= '<span lang="de" class="multilang">';
                results= stringToAnalize.match(new RegExp(openTag_2 + "(.*?)" + closeTag));
            }
            return results[1];
        }
        return stringToAnalize;
    },

    sync: function(method, model, options){
		var Config= new Configuration({id:1});
		Config.fetch();
        var token = Config.get("moodleAccessToken");
        var that= this;

        $.ajax({
            url: Config.get('moodleServiceEndpoint'),
            data: {
                wstoken: token,
                wsfunction: "local_reflect_get_feedbacks",
                moodlewsrestformat: "json",
                courseID: Config.get('courseID')
            },
            headers: Config.get('accessToken')
        })

        .done(function(data) {
            //console.log(" obtained feedbacks: \n"+window.JSON.stringify(data));
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

                    var itemName= item.name;
                    var language= Config.get('appLanguage');
                    itemName= that.processMoodleContents(language,itemName);
                    var feedMsg= item.feedbackMessage;
                    //detect if there is a custom feedback message and process it
                    if(feedMsg != undefined && feedMsg != '')feedMsg= that.processMoodleContents(language,feedMsg);
                    var questionContainer = new QuestionContainer({
                        id: item.id,
                        title: itemName,
                        feedbackMessage: feedMsg,
                    });

                    _.each(item.questions, function(question, i){

                        // 'questionText' text and 'choices' are to be checked for multi language tags
                        var questText= question.questionText;
                        questText= that.processMoodleContents(language,questText);
                        var q = new Question({
                            id: question.id,
                            number: i+1,
                            total: item.questions.length,
                            questionText: questText,
                            type: question.type,
                            dependItem: question.dependitem,
                            dependValue: question.dependvalue,
                            label: question.label
                        });

                        if(question.dependitem != 0){
                            questionContainer.set('conditionalCase',true);
                        }

                        if (question.choices) {
                            // each choice must be checked in order to ensure that the text that is not enclosed
                            //      by multi language tags will be still shown by default, same as Moodle filter
                            var choicesArray= question.choices.substring(6).split('|');
                            var arrayLength= choicesArray.length;
                            for(var k=0; k < arrayLength; k++){
                                var choiceText= choicesArray[k];
                                choicesArray[k]= that.processMoodleContents(language,choiceText);;
                            }
                            q.set("choices",choicesArray);
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

    processMoodleContents: function(language, stringToAnalize){
        //checking for multi language tags
        var matchPattern= /<span lang=/i;
        var found= stringToAnalize.search(matchPattern);
        //form the name of the enclosing tags
        var openTag= '<span lang="'+language+'" class="multilang">';
        var closeTag= '</span>';
        if(found != -1){
            //extract text in the correct language
            var results= stringToAnalize.match(new RegExp(openTag + "(.*?)" + closeTag));
            //if the preferred language was not found, rollback to german
            if(results == null){
                var openTag_2= '<span lang="de" class="multilang">';
                results= stringToAnalize.match(new RegExp(openTag_2 + "(.*?)" + closeTag));
            }
            return results[1];
        }
        return stringToAnalize;
    },

    sync: function(method, model, options){

        var today = new Date();
        var oneYearLater = new Date();
        oneYearLater.setFullYear(today.getFullYear()+1);
		var Config= new Configuration({id:1});
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
					var notifyListSTR= Config.get('notificationsList');
					var notifyListOBJ= window.JSON.parse(notifyListSTR);
					var numElements= notifyListOBJ.titlesToNotify.length;
					var notifyable= 0;
					for(var s=0; s<numElements; s++){
						var appointmentsTitle= notifyListOBJ.titlesToNotify[s];
						if(appointmentsTitle == itemName || appointmentsTitle == title_with_tags){
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
                        title: itemName,
                        fullTitle: title_with_tags,
                        description: itemDescription,
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
  *
  *     the example in question is interesting, but does not implement a multi-nested model
  */

/*
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
*/

var Contact = Backbone.Model.extend({
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

    url:'js/config.json',
    model: Contact,
});

