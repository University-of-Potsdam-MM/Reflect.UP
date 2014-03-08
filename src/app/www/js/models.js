var Appointment = Backbone.Model.extend({
	defaults:{
		title : 'Appointment Title',
        begin : new Date(),
        end : new Date(),

	}
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