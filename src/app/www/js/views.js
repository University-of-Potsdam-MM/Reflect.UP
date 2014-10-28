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

var AppointmentListView = Backbone.View.extend({
    template : _.template($('#template-appointment-list').html()),
    showButton : true,
    limit : -1,
    events: {
        'click #more-appointments-button': 'showAppointments',
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
            var view = new AppointmentListItemView({model : appointment});
            this.$("#appointments").append(view.el);
        }

    },

    showAppointments: function(){
        Backbone.history.navigate("appointments/", {trigger: true});
    },

    onError: function(collection, resp, options){
        alert("Error: " + resp);
    },
});

var QuestionCollectionListView = Backbone.View.extend({
    template : _.template($('#template-question-collection-list').html()),

    initialize : function(){
        this.listenTo(this.model, 'add', this.addOne);
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
        //console.log('adding question container view:', view);
        this.$("#question-collection").append(view.el);
    },

    onError: function(collection, resp, options){
        alert("Error: " + resp);
    },
});

var QuestionContainerView = Backbone.View.extend({
    tagName : 'li',

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
        var destination = $(el.target.parentNode).attr('href');
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
                radioInput.attr('value', count);

                if (1 == count)
                    radioInput.attr('checked', true);

                form.append(radioInput);
                form.append($('<span>').text(choice));
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
        this.saveValues();
        el.preventDefault();
        var q = this.model.get('container').next();

        if (!q){
            this.model.get('container').sendData();
            this.undelegateEvents();
            Backbone.history.navigate('', {trigger: true});
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

    previousQuestion: function(el)
    {
        this.saveValues();
        el.preventDefault();
        var q = this.model.get('container').previous();

        if (!q){
            this.undelegateEvents();
            Backbone.history.navigate('', {trigger: true});
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
        if (this.model.get('type') === "multichoice")
            this.model.set("answerText",
                this.$('#answer input[name=choice]:checked').val());
        else
            this.model.set("answerText",
                this.$('#answer textarea').val());
    }
})

/**
 *  HomeView
 *
 */
var HomeView = Backbone.View.extend({
    el : "#app",
    template : _.template($('#template-home-screen').html()),

    model: Configuration,

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

    render : function(){
        this.$el.html(this.template({title : 'Reflect.UP'}));
        return this;
    }
})

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
        $.get("https://eportfolio.uni-potsdam.de/moodle/login/token.php", {
            username: username,
            password: password,
            service: 'upreflection'
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
        $.get("https://eportfolio.uni-potsdam.de/moodle/webservice/rest/server.php", {
            wstoken: that.model.get("accessToken"),
            wsfunction: "local_upreflection_enrol_self",
            moodlewsrestformat: "json"
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
        this.$el.html(this.template({title: 'Anmeldung'}));
        return this;
    }
})

var AppointmentsView = Backbone.View.extend({
    el: '#app',
    initialize: function(){
        this.render();
        this.AppointmentListView = new AppointmentListView({
            el: '#dates',
            model: Appointments,
            showButton : false,
        });
    },
    template: _.template($('#template-appointments-screen').html()),
    render: function(){
        this.$el.html(this.template({title: 'Termine'}));
        return this;
    },
});

var Router = Backbone.Router.extend({
    routes : {
        '' : 'home',
        'config': 'config',
        'appointments/' : 'appointments',
        'questions/:containerId/:questionId' : 'questions'
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

    questions: function(containerId, questionId){
        var question = Questions.get(containerId).getQuestion(questionId);
        this.switchView(new QuestionView({model: question}));
    }

});