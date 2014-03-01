var Appointment = Backbone.Model.extend({
	defaults:{
		title : 'Appointment Title',

	}
});

var AppointmentCollection = Backbone.Collection.extend({
	model : Appointment

});