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
    }
});

var QuestionCollection = Backbone.Collection.extend({
    model : Question,
    title : 'Question Collection'
});

var QuestionList = Backbone.Collection.extend({
    model : QuestionCollection,
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