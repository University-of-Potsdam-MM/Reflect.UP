/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var Appointments = new AppointmentCollection();
var Questions = new QuestionContainerList();
var Config = new Configuration({id: 1});


$( document ).ready(function() {
    
});

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();

        Config.fetch();

        var token = Config.get("accessToken");
        if (token == "")
            Config.getToken();

        //var v = new HomeView();
        
        
        var router = new Router();
        Backbone.history.start();
        
        

        var qc = new QuestionContainer({id: 1});
        Questions.add(qc);

        var q1 = new Question({
            id: 1,
            questionText: 'q1',
        });

        var q2 = new Question({
            id: 2,
            questionText: 'q2',
        });

        //var l = qc.get('questionList');
        qc.add(q1);
        qc.add(q2);

        //q1.set('next', q2);
        //q2.set('previous', q1);

        //qc.set('firstQuestion', q1);
        //Questions.add(q);
        //qc.add(q);

        


        

        
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    }
};
