/**
 *  @module  feedback.views
 */
define([
    'jquery',
    'backbone',
    'util',
    'feedback/feedback.models'
], function(jquery, Backbone, config, feedbackModels) {
    'use strict';

    /**
     *      FeedbackView
     *      @name FeedbackView
     *      @constructor
     *      @augments Backbone.View
     */
    var FeedbackView = Backbone.View.extend(/** @lends FeedbackView.prototype */{
        el: '#app',
        template: _.template($('#template-feedback').html()),

        events: {
            'click #submitButton': 'submit',
            'click #back_button' : 'back'
        },

        initialize: function() {
            this.model = app.models.Config;
            this.listenTo(this, 'errorHandler', this.errorHandler);
            this.listenTo(this, 'successHandler', this.enrolUser);
        },

        render: function() {
            this.$el.html(this.template({t:_t}));
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
            feedbacktext = $('<div />').text(feedbacktext).html();
            var that = this;
            $.ajax({
                url: that.model.get('moodleServiceEndpoint'),
                data: {
                    wstoken: that.model.get("moodleAccessToken"),
                    wsfunction: "local_reflect_post_feedback",
                    moodlewsrestformat: "json",
                    feedback: feedbacktext,
                    courseID: that.model.get('courseID')
                },
                headers: that.model.get("accessToken")
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
        },

        back: function(){
            this.undelegateEvents();
        }

    });


    /**
     *      FeedbackResultView
     *      @name FeedbackResultView
     *      @constructor
     *      @augments Backbone.View
     */
    var FeedbackResultView = Backbone.View.extend(/** @lends FeedbackResultView.prototype */{
        el: '#app',
        template: _.template($('#template-feedbackresult').html()),

        render: function() {
            this.$el.html(this.template());
            return this;
        }
    });

    return {
        FeedbackView : FeedbackView,
        FeedbackResultView : FeedbackResultView
    }
});