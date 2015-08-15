var AppointmentListItemView = Backbone.View.extend({
    tagName : 'li',

    initialize : function(){
        this.listenTo(this.model, 'change', this.render);
        this.render();
    },

    template : _.template($('#template-appointment-list-item').html()),

    render : function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

var AppointmentListItemFullView = Backbone.View.extend({
    tagName : 'li',

    initialize : function(){
        this.listenTo(this.model, 'change', this.render);
        this.render();
    },

    template : _.template($('#template-appointment-list-item-full').html()),

    render : function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

var AppointmentListView = Backbone.View.extend({
    template : _.template($('#template-appointment-list').html()),
    showButton : true,
    limit : -1,
    events: {
        'error': 'onError',
    },

    initialize : function(options){
        this.model.fetch({error:this.onError});
        this.listenTo(this.model, 'add', this.addOne);

        if("showButton" in options)
            this.showButton = options.showButton;

        if("limit" in options)
            this.limit = options.limit;

        this.render();
        this.delegateEvents();
    },

    render : function() {
        this.$el.html(this.template());

        if(!this.showButton)
            this.$("#more-appointments-button").hide();

        return this;
    },

    addOne : function(appointment){
        if (this.$("#appointments").children().length < this.limit
            || this.limit == -1){
        	if (this.limit == -1) {
        		var view = new AppointmentListItemFullView({model : appointment});
        	}else{
        		var view = new AppointmentListItemView({model : appointment});
        	}
            this.$("#appointments").append(view.el);
        }

    },

    onError: function(collection, resp, options){
        alert("Error: " + resp);
    }
});

var QuestionCollectionListView = Backbone.View.extend({
    template : _.template($('#template-question-collection-list').html()),

    initialize : function(){
        this.listenTo(this.model, 'add', this.addOne);
        this.listenTo(this.model, 'sync', this.render);
        this.model.fetch({error:this.onError});
        this.render();
    },

    render : function() {
        this.$el.html(this.template());

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
        alert("Error: " + resp);
    }
});

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
        //console.log('render', this.model);
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

var QuestionView = Backbone.View.extend({
    el: "#app",
    template: _.template($('#template-question').html()),

    initialize: function(){
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
                containerId: this.model.get('container').get('id'),
            })
        );
        if (this.model.get('type') === "multichoice" &&
            this.model.get('choices')){
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

                var radioLabel = $('<label/>');
                radioLabel.attr('for', 'radio' + count);
                radioLabel.text(choice);

                form.append(radioInput);
                form.append(radioLabel);
                form.append($('<br>'));

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

    nextQuestion: function(el)
    {
        el.preventDefault();
        if (!this.saveValues()) {
            // notify user that he has to choose an answer
            this.$("#answer-feedback").append('<p style="color: red;">Du musst eine Antwort auswählen.</p>')
            return false;
        }

        var q = this.model.get('container').next();

        if (!q){
            this.model.get('container').sendData();
            this.undelegateEvents();
            Backbone.history.navigate('questionsfinish', {trigger: true});
            return false;
        }

        var destination = 'questions/'
            + this.model.get('container').id
            + '/'
            + q.id; //$(el.target).attr('href');
        this.undelegateEvents();
        Backbone.history.navigate(destination, {trigger: true});
        return false;
    },

    previousQuestion: function(el){
        this.saveValues();
        el.preventDefault();
        var q = this.model.get('container').previous();

        if (!q){
            this.undelegateEvents();
            Backbone.history.navigate('#questions', {trigger: true});
            return false;
        }

        var destination = 'questions/'
            + this.model.get('container').id
            + '/'
            + q.id;
        this.undelegateEvents();
        Backbone.history.navigate(destination, {trigger: true});
        return false;
    },

    saveValues: function(){
        if (this.model.get('type') === "multichoice") {
            this.model.set("answerText", this.$('#answer input[name=choice]:checked').val());
            return this.model.get("answerText");
        } else {
            this.model.set("answerText", this.$('#answer textarea').val());
            return true;
        }
    }
})

/**
 *  Backbone Page View - QuestionsFinishView
 *  view displayed after finishing all questions of a container
 */
 var QuestionsFinishView = Backbone.View.extend({
    el : "#app",
    template : _.template($('#template-question-finish').html()),

    initialize: function(){
        this.render();
    },

    render: function(){
        this.$el.html(this.template());
        return this;
    }
 })

/**
 *  Backbone Page View - HomeView
 */
var HomeView = Backbone.View.extend({
    el : "#app",
    template : _.template($('#template-home-screen').html()),
    model: Configuration,

    events: {
        'click .footerlink': 'impressum'
    },

    initialize : function() {
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
            this.AppointmentListView = new AppointmentListView({
                el : '#dates',
                model : Appointments,
                limit : 3,
            });

            this.QuestionCollectionListView = new QuestionCollectionListView({
                el: '#questions',
                model: Questions
            });
        }
    },

    impressum: function(){
        Backbone.history.navigate('impressum', { trigger : true });
    },

    render : function(){
        this.$el.html(this.template({title : 'Reflect.UP'}));
        return this;
    }
})

/**
 *  Backbone Page View - ConfigView
 */
var ConfigView = Backbone.View.extend({
    el: '#app',
    template: _.template($('#template-config-screen').html()),
    events: {
        'submit #loginform': 'submit'
    },

    model: Configuration,

    initialize: function(){
        this.listenTo(this, 'errorHandler', this.errorHandler);
        this.listenTo(this, 'enrolUser', this.enrolUser);
        this.model = Config;
        this.render();
    },

    /**
     *  TODO: Error Handling
     */
    submit: function(ev){
        ev.preventDefault();
        var username = $('#username').val();
        var password = $('#password').val();
        var that = this;
        $.ajax({
            url: moodleLoginEndpoint,
            data: {
                username: username,
                password: password,
                service: 'upreflection'
            },
            headers: accessToken
        }).done(function(data){
            console.log(data);
            if (data.error){
                that.trigger('errorHandler');
            }else{
                that.model.set("accessToken", data.token)
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
        var that = this;
        $.ajax({
            url: moodleServiceEndpoint,
            data: {
                wstoken: that.model.get("accessToken"),
                wsfunction: "local_upreflection_enrol_self",
                moodlewsrestformat: "json"
            },
            headers: accessToken
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

    },

    render: function(){
        this.$el.html(this.template({title: 'Reflect.UP - Anmeldung'}));
        return this;
    }
})

/**
 *  Backbone Page View - ImpressumView
 */
var ImpressumView = Backbone.View.extend({
    el: '#app',
    template: _.template($('#template-impressum').html()),

    initialize: function(){
        this.render();
    },

    render: function(){
        this.$el.html(this.template());
        return this;
    }
});

/**
 *  Backbone Page View - FeedbackView
 */
var FeedbackView = Backbone.View.extend({
    el: '#app',
    template: _.template($('#template-feedback').html()),

    events: {
        'submit': 'submit'
    },

    initialize: function() {
        this.render();
        this.model = Config;
        this.listenTo(this, 'errorHandler', this.errorHandler);
        this.listenTo(this, 'successHandler', this.enrolUser);
    },

    render: function() {
        this.$el.html(this.template());
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
            url: moodleServiceEndpoint,
            data: {
                wstoken: that.model.get("accessToken"),
                wsfunction: "local_upreflection_post_feedback",
                moodlewsrestformat: "json",
                feedback: feedbacktext
            },
            headers: accessToken
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
 *  Backbone Page View - FeedbackResultView
 */
var FeedbackResultView = Backbone.View.extend({
    el: '#app',
    template: _.template($('#template-feedbackresult').html()),

    initialize: function() {
        this.render();
    },

    render: function() {
        console.log('render');
        this.$el.html(this.template());
        return this;
    }
});

/**
 *  Backbone Page View - AppointmentsView
 */
var AppointmentsView = Backbone.View.extend({
    el: '#app',
    template: _.template($('#template-appointments-screen').html()),

    initialize: function(){
        this.render();
        this.AppointmentListView = new AppointmentListView({
            el: '#dates',
            model: Appointments,
            showButton : false,
        });
    },

    render: function(){
        this.$el.html(this.template({title: 'Termine'}));
        return this;
    }
});


/**
 *  Backbone Page View - QuestionsView
 *  view for all questions
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
            this.QuestionCollectionListView = new QuestionCollectionListView({
                el: '#questions',
                model: Questions
            });
        }
    },

    render: function(){
        this.$el.html(this.template({title: 'Reflektionsfragen'}));
        return this;
    }
});


/**
 * Backbone Page View - ContactPersonsView
 * view for all contact persons
 */
var ContactPersonsView = Backbone.View.extend({
    el: '#app',
    template: _.template($('#template-contact-persons').html()),

    initialize: function() {
        this.collection = new ContactPersonCollection();
        this.listenTo(this.collection, "sync error", this.render);

        this.render();
        this.collection.fetch();
    },

    render: function() {
        this.$el.html(this.template({title: 'Ansprechpartner', contacts: this.collection.toJSON()}));
        return this;
    }
});


/**
 *  Routes
 */
var Router = Backbone.Router.extend({
    routes : {
        '' : 'home',
        'config': 'config',
        'appointments' : 'appointments',
        'questions': 'questions',
        'questions/:containerId/:questionId' : 'question',
        'questionsfinish': 'questionsfinish',
        'impressum': 'impressum',
        'feedback': 'feedback',
        'feedbackresult' : 'feedbackresult',
        'contactpersons': 'contactpersons'
    },

    switchView : function(view){
        if (this.view){
            if (this.view.destroy)
                this.view.destroy();

            this.view = null;
        }
        this.view = view;
    },

    home : function(){
        console.log('home');
        this.switchView(new HomeView({}));
    },

    config: function(){
        console.log('config');
        this.switchView(new ConfigView({}));
    },

    appointments: function(){
        this.switchView(new AppointmentsView())
    },

    questions: function(){
        this.switchView(new QuestionsView())
    },

    question: function(containerId, questionId){
        var question = Questions.get(containerId).getQuestion(questionId);
        this.switchView(new QuestionView({model: question}));
    },

    questionsfinish: function(){
        this.switchView(new QuestionsFinishView())
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
    }
});