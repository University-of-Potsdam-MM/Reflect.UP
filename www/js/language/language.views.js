/**
 *  @module  language.views
 */
define([
    'jquery',
    'backbone',
    'util'
], function(jquery, Backbone, config) {
    'use strict';

    /*      LanguagesPageView
     *      @name LanguagesPageView
     *      @constructor
     *      @augments Backbone.View
     */
    var LanguagesPageView = Backbone.View.extend(/** @lends LanguagesPageView.prototype */{
        initialSetupCase: false,
        el: '#app',
        template: _.template($('#template-languages-selection').html()),
        events: {
            "click #changeButton": "changeLanguage"
        },

        initialize: function(options) {
            this.model = new config.Configuration({id:1});
            if ("caseInit" in options){
                this.initialSetupCase= true;
            }
            this.render();
        },

        changeLanguage: function(){
            this.model.fetch();
            //get the new selected language
            var selected_language= $("#language-select option:selected").val();
            //if selected language is the current one, no change is necessary
            if(selected_language == this.model.get('appLanguage')){
                if (this.initialSetupCase){
                    this.initialSetupCase = false;
                    Backbone.history.navigate('initialSetup', { trigger : true });
                }else{
                    Backbone.history.navigate('', { trigger : true });
                }
            }
            //else, apply the changes
            this.model.set('appLanguage',selected_language);
            this.model.save();
            i18next.changeLanguage(selected_language);
            console.log("i18next language has been set to: "+selected_language);
            //menu and infopanel have to be newly rendered to the selected language
            $('#panel-menu').text(i18next.t("panelMenu"));
            $('#more-appointments-button').text(i18next.t("panelAppointments"));
            $('#more-questions-button').text(i18next.t("panelQuestions"));
            $('#panel-contact-persons').text(i18next.t("panelContact"));
            $('#panel-feedback').text(i18next.t("panelFeedback"));
            $('#panel-languages').text(i18next.t("panelLanguages"));
            $('#panel-home').text(i18next.t("panelHome"));
            $('#panel-logout').text(i18next.t("panelLogout"));
            $('#infopanel-content').html(i18next.t("infoMessage_1"));
            //navigate to home
            if (this.initialSetupCase){
                this.initialSetupCase = false;
                this.undelegateEvents();
                Backbone.history.navigate('initialSetup', { trigger : true });
            }else{
                this.undelegateEvents();
                Backbone.history.navigate('', { trigger : true });
            }
        },

        render: function(){
            this.model.fetch();
            var current_language= this.model.get('appLanguage');
            var preSelectedLang= 0;
            if(current_language == 'en')preSelectedLang= 1;
            else if(current_language == 'es')preSelectedLang= 2;
            if(!this.initialSetupCase){
                this.$el.html(this.template({t: _t, caseInit: false, selectedLang : preSelectedLang}));
                return this;
            }else {
                this.$el.html(this.template({t: _t, caseInit: true, selectedLang : preSelectedLang}));
                //this.initialSetupCase= false;
                return this;
            }
        }
    });

    return {
        LanguagesPageView : LanguagesPageView
    }

});