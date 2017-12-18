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

            this.collection = new contactModels.ContactPersonCollection();
            var that= this;
            this.collection.fetch({
                headers: {'Authorization' :'Bearer 732c17bd-1e57-3e90-bfa7-118ce58879e8'},
                success: function () {
                    that.render();
                },
                error: function() {
                    that.collection.fetch().done(function(){
                        that.renderWrap();
                    });
                }
            });
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
            // parsing method of the obtained collection of contacts is going to be different if the json object
            //  is provided from a general config.json file (a third level of parsing is needed + only the
            //  corresponding contact persons page to the recorded course ID is to be loaded)
            var Config= new config.Configuration({id:1});
            Config.fetch();
            var cID= Config.get('courseID');
            this.$el.html(this.template({contacts: this.collection, t:_t, courseID: cID}));
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