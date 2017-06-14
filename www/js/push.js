/**
 *  @module  push
 */
var global_registrationId = "";

var pushDetails = {
	senderID: "38438927043",
	uniqushUrl: "https://api.uni-potsdam.de/endpoints/pushAPI/",
	serviceName: "reflectup",
    authHeader: { "Authorization": "Bearer c06156e119040a27a4b43fa933f130" }
};

/**
 *  function for creation of options used for uniqush interaction
 *  @constructor
 *  @param {int} id - device id
 */
var UniqushCreateOptions = function(id) {
    var result = {
        service: pushDetails.serviceName
    };

    if (device.platform === "iOS") {
        result.devtoken = id;
        result.subscriber = "ios-" + id;
        result.pushservicetype = "apns";
    } else {
        result.regid = id;
        result.subscriber = "android-" + id.replace(/:/g, "");
        result.pushservicetype = "gcm";
    }

    return result;
}


/**
 *  function for subscription to the uniqush push service
 *  @constructor
 *  @param {int} registrationId - registrationId
 */
var SubscribeToUniqush = function(registrationId) {
    var url_subscribe= pushDetails.uniqushUrl.concat("subscribe");
	var uri = new URI(url_subscribe);
	uri.search(UniqushCreateOptions(registrationId));

	console.log("Registering push via " + uri.href());

	$.ajax({
		url: uri.href(),
		headers: pushDetails.authHeader,
		success: function(response) { console.log("Successfully contacted uniqush server. Server responded with " + response); },
		error: function() { console.log("Some error happened while contacting the uniqush server"); }
	});
};


/**
 *  function for unsubscription to the uniqush push service
 *  @constructor
 */
var UnsubscribeToUniqush = function(){
    var url_unsubscribe= pushDetails.uniqushUrl.concat("unsubscribe");
    var regID= global_registrationId;
    var uri= new URI(url_unsubscribe);
    uri.search(UniqushCreateOptions(regID));

    $.ajax({
        url: uri.href(),
        headers: pushDetails.authHeader,
        success: function(response) { console.log("Successfully contacted uniqush server. Server responded with " + response); },
        error: function() { console.log("Some error happened while contacting the uniqush server"); }
    });

}


/**
 *  function for registration to the uniqush push service
 *  @constructor
 *  @param {string} courseID - id of a moodle course
 */
var PushServiceRegister = function(courseID){
    if (typeof PushNotification === "undefined") {
        console.log("PushNotification NOT available");
        return;
    }
    // reset value of pushDetails.serviceName to the original value to prevent 
    //      appending IDs of previous selected courses
    pushDetails.serviceName= "reflectup";
    pushDetails.serviceName= pushDetails.serviceName.concat("-"+courseID);
	var push = PushNotification.init({
        android: {
            senderID: pushDetails.senderID
        },
        browser: {
            pushServiceURL: "http://www.google.de"
        },
        ios: {
            alert: "true",
            badge: "true",
            sound: "true"
        },
        windows: {}
    });

    push.on("registration", function(data) {
        // Registration ID received, inform uniqush-push server
        if (data.registrationId.length == 0) {
            // empty id, what do we do?
            console.log("ERROR: Push registration id empty");
        } else {
            global_registrationId= data.registrationId;
            SubscribeToUniqush(data.registrationId);
        }
    });

    push.on("notification", function(data) {
        // push notification received, inform app
        navigator.notification.beep(2);

        function onConfirm(buttonIndex) {
            //alert('You selected button ' + buttonIndex);
        }

        //obtain current language from the Configuration model in local storage
        var Config= new Configuration({id:1});
        Config.fetch();
        var language= Config.get('appLanguage');
        //filter according to language and consider German to be the default language
        var dataObj= window.JSON.parse(data.message);
        var message= "";
        var title= "";
        if(dataObj[language].message != ""){
            message= dataObj[language].message;
        }else{
            message= dataObj['de'].message;
        }
        if(dataObj[language].message != ""){
            title= dataObj[language].title;
        }else{
            title= dataObj['de'].title;
        }

        navigator.notification.alert(
            message,           // message
            onConfirm,         // callback
            title,            // title
            'OK'                  // buttonName
        );
        //console.log("Push notification received: " + JSON.stringify(data));
    });

    push.on("error", function(data) {
        // error happened
        console.log("Push error happened: " + data.message);
    });
};