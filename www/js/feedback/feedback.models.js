/**
 *  @module  feedback.models
 */
define([
    'jquery',
    'backbone'
], function(jquery, Backbone) {
    'use strict';

    /**
     *      model for holding feedbacks
     *      @name Feedback
     *      @constructor
     *      @augments Backbone.Model
     */
    var Feedback = Backbone.Model.extend({
        defaults:{
                    feedbackText : null,
        }
    });


});