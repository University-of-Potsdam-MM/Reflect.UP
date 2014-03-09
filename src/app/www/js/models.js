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
	model : Appointment

});

var Screen = Backbone.Model.extend({
    defaults : {
        title : "Screen title",
        content : "",
    },
})