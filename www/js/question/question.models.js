/**
 *  @module  question.models
 */
define([
    'jquery',
    'backbone',
    'util'
], function(jquery, Backbone, config) {
    'use strict';


    /**      model for holding questions
     *      @name Question
     *      @constructor
     *      @augments Backbone.Model
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
            multiple_choice: 0
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


    /**      collection holding all question items
     *      @name QuestionList
     *      @constructor
     *      @augments Backbone.Collection
     */
    var QuestionList = Backbone.Collection.extend(/** @lends QuestionList.prototype */{
        /** @type {Question} */
        model: Question
    });


    /**      QuestionContainer model for single question
     *      @name QuestionContainer
     *      @constructor
     *      @augments Backbone.Model
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


    /**      Collection - QuestionContainerList
     *      ToDo: Triggered twice
     *      @name QuestionContainerList
     *      @constructor
     *      @augments MoodleCollection
     */
    var QuestionContainerList = config.MoodleCollection.extend(/** @lends QuestionContainerList.prototype */{
        /** @type {QuestionContainer} */
        model : QuestionContainer,

        sync: function(method, model, options){
            var Config= new config.Configuration({id:1});
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

                        var language= Config.get('appLanguage');
                        var itemName= item.name;
                        itemName = that.processMoodleContents(language, itemName);

                        var feedMsg = item.feedbackMessage;
                        feedMsg = that.processMoodleContents(language, feedMsg);

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
                                dependValue: question.dependvalue
                            });

                            if(question.dependitem != 0){
                                questionContainer.set('conditionalCase',true);
                            }

                            if (question.choices) {
                                //verify if the first character of the 'question.choices' is 'c' for 'checkbox'
                                if(question.choices.substring(0,1) == 'c'){
                                    q.set("multiple_choice",1);
                                }
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

    return {
        QuestionContainerList : QuestionContainerList
    }

});