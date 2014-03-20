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
    events: {
        'click #more-appointments-button': 'showAppointments',
        'error': 'onError',
    },

    initialize : function(options){
        this.model.fetch({error:this.onError});
        this.listenTo(this.model, 'add', this.addOne);

        if("showButton" in options)
            this.showButton = options.showButton;

        this.render();
        this.delegateEvents();
    },

    render : function() {
        this.$el.html(this.template());

        if(!this.showButton)
            this.$("#more-appointments-button").hide();

        if (this.model.length){
            this.model.each( function(appointment){
                this.$("#appointments").append(
                    new AppointmentListItemView({model : appointment}).el);
            }, this)
        }

        return this;
    },

    addOne : function(appointment){
        if(this.model.length == 1)
            this.$("#appointments").empty();

        var view = new AppointmentListItemView({model : appointment});
        this.$("#appointments").append(view.el);
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

        this.render();
    },

    render : function() {
        this.$el.html(this.template());

        if (this.model.length){
            this.model.each( function(questionCollection){
                this.$("#question-collection").append(
                    new QuestionCollectionListItemView({model : questionCollection}).el);
            }, this)
        }
        
        return this;
    },

    addOne : function(questionCollection){
        
        var view = new QuestionCollectionListItemView({model : questionCollection});
        this.$("#question-collection").append(view.el);
    }
});

var QuestionCollectionListItemView = Backbone.View.extend({
    tagName : 'li',

    initialize : function(){
        this.listenTo(this.model, 'change', this.render);

        this.render();
    },

    template : _.template($('#template-question-collection-list-item').html()),

    render : function() {
        this.$el.html(this.template({title : this.model.title}));
        return this;
    }
});

var HomeView = Backbone.View.extend({
    el : "#app",
    

    initialize : function() {
        this.render();

        this.AppointmentListView = new AppointmentListView({
            el : '#dates',
            model : Appointments,
        });

        this.QuestionCollectionListView = new QuestionCollectionListView({
            el: '#questions',
            model: Questions
        });
    },
    template : _.template($('#template-home-screen').html()),
    render : function(){
        this.$el.html(this.template({
            title : 'UPReflection'
        }))
        
        return this;
    },
    
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
        'appointments/' : 'appointments'
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
        this.switchView(new HomeView());
    },

    appointments: function(){
        this.switchView(new AppointmentsView())
    },

});