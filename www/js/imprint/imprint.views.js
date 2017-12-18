/**
 *  @module  imprint.views
 */
define([
    'jquery',
    'backbone',
    'util'
], function(jquery, Backbone, config) {
    'use strict';

    /**     ImpressumView
     *      @name ImpressumView
     *      @constructor
     *      @augments Backbone.View
     */
    var ImprintView = Backbone.View.extend(/** @lends ImpressumView.prototype */{
        configCase : false,
        el: '#app',
        template: _.template($('#template-impressum').html()),

        initialize: function(options){
            if("caseConfig" in options){
                this.configCase = true;
            }
            this.render();
        },

        render: function(){
            if(!this.configCase){
                this.$el.html(this.template({caseConfiguration : false}));
            }
            else{
                this.$el.html(this.template({caseConfiguration : true}));
            }
            // fill the emptied template with the contents of Configuration´s
            //      'impressumTemplate' attribute
            var Config = new config.Configuration({id:1});
            Config.fetch();
            var htmlString= Config.get('impressumTemplate');
            this.$("#impressum-html-content").append(htmlString);
            // alternatively, load the logo of the University and display it
            //      at the end of the document
            //var logoPath= Config.get('uniLogoPath');
            //if(logoPath != ''){
            //    var imgTag = $('<img alt="university_logo">');
            //    imgTag.attr('src',logoPath);
            //    this.$("#logo-container").append(imgTag);
            //    return this;
            //}
        }
    });

    return {
        ImprintView : ImprintView
    }

});