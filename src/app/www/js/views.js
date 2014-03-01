var AppointmentListItemView = Backbone.View.extend({
    tagName : 'li',

    initialize : function(){
        this.listenTo(this.model, 'change', this.render);
    },

    render : function() {
        this.$el.html(this.model.get('title'));
        return this;
    }
});

var AppointmentListView = Backbone.View.extend({
    tagName : 'ul',
    
    initialize : function(){
        this.listenTo(this.model, 'add', this.addOne);
    },

    render : function() {
        if (this.model.length){
            this.model.each( function(appointment){
                this.$el.append(
                    new AppointmentListItemView({model : appointment}).render().el);
            }, this)
        }
        else {
            this.$el.append('Empty List')
        }
        return this;
    },

    addOne : function(appointment){
        if(this.model.length == 1)
            this.$el.empty();

        var view = new AppointmentListItemView({model : appointment});
        this.$el.append(view.render().el);
    }
});

var AppView = Backbone.View.extend({
    el : $("#app"),
    initialize : function() {
        this.AppointmentListView = new AppointmentListView({
            model : MyCollection
        });
    },
    render : function() {
        this.$el.html(this.AppointmentListView.render().el)
    }
});