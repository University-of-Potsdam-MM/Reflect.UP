var Configuration = Backbone.Model.extend({
    localStorage: new Backbone.LocalStorage("UPReflection"),

    defaults:{
        accessToken: '',
    },

    getToken: function()
    {
        var that = this;
        $.get("http://localhost:8080/Moodle/login/token.php", {
            username: 'test2',
            password: 'Test2123.',
            service: 'upreflection'
        }).done(function(data){
            that.set("accessToken", data.token)
            that.save();
        })
    }

});


var Appointment = Backbone.Model.extend({
	defaults:{
		title : 'Appointment Title',
        begin : new Date(),
        end : new Date(),

	}
});

var Question = Backbone.Model.extend({
    defaults: {
        questionText: 'Question Text',
        answerText : 'Answer Text',
        previous : null,
        next : null,
        container: null,
    },

    hasPrevious: function(){
         if (this.get('container').get('currentIndex') == 0)
            return false;

        return true;
    },

    hasNext: function(){
        var container = this.get('container');
        if (container.get('currentIndex') == container.get('questionList').length - 1)
            return false;

        return true;
    },

    nextId: function(){
        if (!this.hasNext())
            return;

        var container = this.get('container');
        return container.get('questionList').at(container.get('currentIndex')+1).id;
    },

    previousId: function(){
        if (!this.hasPrevious())
            return;

        var container = this.get('container');
        return container.get('questionList').at(container.get('currentIndex')-1).id;
    },
});

var QuestionContainer = Backbone.Model.extend({

    defaults: {
        title : 'Questions',
        currentIndex: 0,
        firstQuestion: null,
        questionList: null,
    },

    initialize: function()
    {
        this.set('questionList', new QuestionList());
    },

    next: function()
    {
        if (this.get('currentIndex') == this.length - 1)
            return null;

        this.set('currentIndex', this.get('currentIndex') + 1);
        return this.get('questionList').at(this.get('currentIndex'));
        return this.current();
    },

    

    previous: function()
    {
        if (this.get('currentIndex') <= 0)
            return null;

        this.set('currentIndex', this.get('currentIndex') - 1);
        return this.current();
    },

    current: function()
    {
        return this.get('questionList').at(this.get('currentIndex'));
    },

    add: function(element)
    {
        element.set('container', this);
        return this.get('questionList').add(element);
    },

    getQuestion: function(id)
    {
        return this.get('questionList').get(id);
    },

    setCurrent: function(id)
    {
        
    }

});

var QuestionList = Backbone.Collection.extend({
    model: Question,
})

var QuestionContainerList = Backbone.Collection.extend({
    model : QuestionContainer,

    sync: function(method, model, options){

        var token = Config.get("accessToken");

        $.get("http://localhost:8080/Moodle/webservice/rest/server.php", {
            wstoken: token,
            wsfunction: "local_upreflection_get_feedbacks",
            moodlewsrestformat: "json",
        })

        .done(function(data) {

            if (data.message) {
                if (options && options.error)
                    options.error(data.message);

                return;
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
                        title: item.name});

                    _.each(item.questions, function(question_item){
                        questionContainer.add(new Question({
                            id: question_item.id,
                            questionText: question_item.questionText,
                            //TODO: type and choices
                        }));
                    });

                    result.push(questionContainer);
                });

                options.success(result);
        });

    },
});

var AppointmentCollection = Backbone.Collection.extend({
	model : Appointment,
   

    sync: function(method, model, options){

        var today = new Date();
        var oneYearLater = new Date();
        oneYearLater.setFullYear(today.getFullYear()+1);
        var token = Config.get("accessToken");

        $.get("http://localhost:8080/Moodle/webservice/rest/server.php", {
            wstoken: token,
            wsfunction: "local_upreflection_get_calendar_entries",
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
                ignorehidden: 0,
            }
        })

        .done(function(data) {

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
                    result.push(new Appointment({
                        title: item.name,
                        begin : new Date(item.timestart * 1000),
                        end: new Date((item.timestart + item.timeduration)*1000),
                    }))                   
                });

                options.success(result);
        });

    },


});

var Screen = Backbone.Model.extend({
    defaults : {
        title : "Screen title",
        content : "",
    },
})