/**
 *  @module  contact.views
 */
define([
    'jquery',
    'backbone',
    'util',
    'contact/contact.models'
], function($, Backbone, config, contactModels) {
    'use strict';

    /**
     *      ContactPersonsView
     *      @name ContactPersonsView
     *      @constructor
     *      @augments Backbone.View
     */
    var ContactPersonsView = Backbone.View.extend(/** @lends ContactPersonsView.prototype */{
        el: '#app',
        template: _.template($('#template-contact-persons').html()),
        events: {
            "click a.external": "openExternal"
        },

        initialize: function() {

            //this.listenTo(this.collection, "sync", this.render);
            var Config = new config.Configuration({id:1});
            Config.fetch();
            this.collection = new contactModels.ContactPersonCollection(Config.get('contactPersonsObject'));


        },

        openExternal: function(event) {
            var url = $(event.currentTarget).attr("href");

            if (window.cordova) {
                console.log("Opening " + url + " in system");
                window.open(url, "_system");
                return false;
            }
        },

        render: function() {
            this.undelegateEvents();

            this.$el.html(this.template({contacts: this.collection, t:_t}));
            // Accordion Logic
            var acc = document.getElementsByClassName("accordion");
            var i;

            for (i = 0; i < acc.length; i++) {
                acc[i].onclick = function(){
                    this.classList.toggle("active");
                    this.nextElementSibling.classList.toggle("show");
                }
            }

            this.delegateEvents();
            return this;
        }
    });

    return {
        ContactPersonsView : ContactPersonsView
    }

});