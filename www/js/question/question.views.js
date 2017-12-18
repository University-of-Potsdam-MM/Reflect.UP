/**
 *  @module  question.views
 */
define([
    'jquery',
    'backbone',
    'util',
    'question/question.models'
], function(jquery, Backbone, util, questionModels) {
    'use strict';

    /**     view for questions
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


    /**     view for QuestionContainer
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


    /**      QuestionsView
     *      @name QuestionsView
     *      @constructor
     *      @augments Backbone.View
     */
    var QuestionsView = Backbone.View.extend(/** @lends QuestionsView.prototype */{
        el: '#app',
        template: _.template($('#template-questions-screen').html()),
        /** @type {Configuration} */
        model: util.Configuration,

        initialize: function(){
            this.model = app.models.Config;
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
                model: app.models.Questions
            });
            return this;
        }
    });


    /*      View - QuestionView
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
    });

    return {
        QuestionsView : QuestionsView,
        QuestionCollectionListView : QuestionCollectionListView
    }

});