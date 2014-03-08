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
    
    initialize : function(){
        this.listenTo(this.model, 'add', this.addOne);

        this.render();
    },

    render : function() {
        if (this.model.length){
            this.$el.html(this.template());
            this.model.each( function(appointment){
                this.$("#appointments").append(
                    new AppointmentListItemView({model : appointment}).el);
            }, this)
        }
        else {
            this.$el.html(this.template());
        }
        return this;
    },

    addOne : function(appointment){
        if(this.model.length == 1)
            this.$("#appointments").empty();

        var view = new AppointmentListItemView({model : appointment});
        this.$("#appointments").append(view.el);
    }
});

var HomeView = Backbone.View.extend({
    el : $("#app"),
    initialize : function() {
        this.render();

        this.AppointmentListView = new AppointmentListView({
            el : '#dates',
            model : MyCollection
        });


    },
    template : _.template($('#template-home-screen').html()),
    render : function(){
        this.$el.html(this.template({
            title : 'UPReflection'
        }))
        
        return this;
    }
})

var Router = Backbone.Router.extend({
    routes : {
        '' : 'home',
    },

    switchView : function(view){
        if (this.view){
            if (this.view.destroy)
                this.view.destroy();

            this.view = null;
        }
        this.view = view;
        $("body").html(view.el);            
    },


    home : function(){
        this.switchView(new HomeView());
    },

});