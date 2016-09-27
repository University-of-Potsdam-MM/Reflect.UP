var pushDetails = {
	senderID: "38438927043",
	uniqushUrl: "https://api.uni-potsdam.de/endpoints/pushAPI/subscribe",
	serviceName: "reflectup",
    authHeader: { "Authorization": "Bearer c06156e119040a27a4b43fa933f130" }
};

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

var SubscribeToUniqush = function(registrationId) {
	var uri = new URI(pushDetails.uniqushUrl);
	uri.search(UniqushCreateOptions(registrationId));

	console.log("Registering push via " + uri.href());

	$.ajax({
		url: uri.href(),
		headers: pushDetails.authHeader,
		success: function(response) { console.log("Successfully contacted uniqush server. Server responded with " + response); },
		error: function() { console.log("Some error happened while contacting the uniqush server"); }
	});
};

var PushServiceRegister = function(){
    if (typeof PushNotification === "undefined") {
        console.log("PushNotification NOT available");
        return;
    }

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
            SubscribeToUniqush(data.registrationId);
        }
    });

    push.on("notification", function(data) {
        // push notification received, inform app
        console.log("Push notification received: " + JSON.stringify(data));
    });

    push.on("error", function(data) {
        // error happened
        console.log("Push error happened: " + data.message);
    });
};