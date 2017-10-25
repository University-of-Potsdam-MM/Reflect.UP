/**
 *  @module  push
 */
var global_registrationId = "";

/**
 *  function for creation of options used for uniqush interaction
 *  @constructor
 *  @param {int} id - device id
 */
var UniqushCreateOptions = function(id, pushDetails) {
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
var SubscribeToUniqush = function(registrationId, pushDetails) {
    var url_subscribe= pushDetails.uniqushUrl.concat("subscribe");
	var uri = new URI(url_subscribe);
	uri.search(UniqushCreateOptions(registrationId, pushDetails));

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
var UnsubscribeToUniqush = function(pushDetails){
    var url_unsubscribe= pushDetails.uniqushUrl.concat("unsubscribe");
    var regID= global_registrationId;
    var uri= new URI(url_unsubscribe);
    uri.search(UniqushCreateOptions(regID, pushDetails));

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
var PushServiceRegister = function(courseID, pushDetails){
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
            SubscribeToUniqush(data.registrationId, pushDetails);
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
        var message= "";
        var title= "";
        if(language == 'de'){
            title= data.additionalData.title_DE;
            message= data.additionalData.message_DE;
        }else if(language == 'es'){
            title= data.additionalData.title_ES;
            message= data.additionalData.message_ES;
        }
        else if(language == 'en'){
            title= data.additionalData.title_EN;
            message= data.additionalData.message_EN;
        }
        // if there is no title/message on the locally selected language, use the german title/message
        //  as default
        if(message == '' || title == ''){
            title= data.additionalData.title_DE;
            message= data.additionalData.message_DE;
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