/**
 *  @module  contact.models
 */
define([
    'jquery',
    'backbone'
], function($, Backbone) {
    'use strict';


    var configURL = "https://moodle-test.europa-uni.de/reflect.json";

    /**
     *      model for a contact information
     *      @name Contact
     *      @constructor
     *      @augments Backbone.Model
     */
    var Contact = Backbone.Model.extend({});


    /**
     * ContactPersonCollection - Contact list with two category levels.
     * See https://eportfolio.uni-potsdam.de/moodle/pluginfile.php/568/mod_folder/content/0/Ansprechpartner%20Studienstart_WiSo_F%C3%A4cher.pdf?forcedownload=1 for data visualisation.
     *
     * JSON structure:
     * [{
     *   category: ...,
     *   content: [{
     *     category: <optional>,
     *     content: [{
     *       name: <optional>,
     *       comment: <optional>,
     *       location: <optional>,
     *       tel: <optional>,
     *       alt_tel: <optional>,
     *       secretary: <optional>,
     *       mail: <optional>,
     *       consultation: <optional>,
     *       consultation_url: <optional>
     *     }]
     *   }]
     * }]
     *      @name ContactPersonCollection
     *      @constructor
     *      @augments Backbone.Collection
     */
    var ContactPersonCollection = Backbone.Collection.extend(/** @lends ContactPersonCollection.prototype */{
        /** @type {Contact} */
        model: Contact,
        url: configURL
    });

    return {
        ContactPersonCollection : ContactPersonCollection
    }

});